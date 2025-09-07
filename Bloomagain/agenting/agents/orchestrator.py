import os
import re
from datetime import datetime
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.prompts import PromptTemplate
from langchain.tools import tool
from langchain.tools.render import render_text_description_and_args
from langchain.agents.output_parsers import JSONAgentOutputParser
from langchain.agents.format_scratchpad import format_log_to_str
from langchain.agents import AgentExecutor
from langchain.memory import ConversationBufferMemory
from langchain_core.runnables import RunnablePassthrough
import pandas as pd

# Import the agents
from basic_query import BasicQueryAgent
from consultation import ConsultationAgent
from diet import DietAgent
from exercise import ExerciseAgent
import json
load_dotenv()

# --- Centralized Data Loading ---
try:
    users_df = pd.read_csv('data/userData.csv').set_index('user_id')
    symptom_logs_df = pd.read_csv('data/userLogData.csv').set_index('user_id')
    print("Data files loaded successfully.")
except FileNotFoundError as e:
    print(f"FATAL ERROR: {e}. The agent will not have access to user data.")
    users_df = None
    symptom_logs_df = None

# --- LLM Initialization ---
google_api_key = os.getenv("GOOGLE_API_KEY")
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=google_api_key,
    temperature=0.1,  # Lower temperature for more focused responses
    max_output_tokens=200,  # Reduced max tokens
    stop=[
        "Question:", 
        "\nQuestion:", 
        "Human:", 
        "Observation",
        "USER QUESTION:",
        "ASSISTANT:",
        "User:",
        "Assistant:",
        "User previously asked:",
        "You previously responded:"
    ],
)

class Orchestrator:
    def __init__(self, llm):
        self.llm = llm
        # Dictionary to store conversation history for each user
        self.conversation_history = {}
        
        # Initialize all agents
        self.basic_query_agent = BasicQueryAgent(llm)
        self.consultation_agent = ConsultationAgent(llm)
        self.diet_agent = DietAgent(llm)
        self.exercise_agent = ExerciseAgent(llm)

    def get_conversation_context(self, user_id, max_exchanges=2):
        """Get recent conversation context for a user"""
        if user_id not in self.conversation_history:
            return "No previous conversation history."
        
        history = self.conversation_history[user_id]
        # Get last N exchanges (each exchange has user query + assistant response)
        recent_history = history[-(max_exchanges * 2):]
        
        if not recent_history:
            return "No previous conversation history."
        
        context_lines = []
        for i in range(0, len(recent_history), 2):
            if i + 1 < len(recent_history):
                user_msg = recent_history[i]
                assistant_msg = recent_history[i + 1]
                # Changed format to be less confusing to LLM
                context_lines.append(f"User previously asked: {user_msg}")
                context_lines.append(f"You previously responded: {assistant_msg}")
        
        return "\n".join(context_lines)

    def save_conversation_exchange(self, user_id, user_query, assistant_response):
        """Save the conversation exchange for this user"""
        if user_id not in self.conversation_history:
            self.conversation_history[user_id] = []
        
        # Add the user query and assistant response
        self.conversation_history[user_id].append(user_query)
        self.conversation_history[user_id].append(assistant_response)
        
        # Keep only last 10 exchanges (20 messages) to prevent memory bloat
        if len(self.conversation_history[user_id]) > 20:
            self.conversation_history[user_id] = self.conversation_history[user_id][-20:]

    def is_first_query(self, user_id):
        """Check if this is the user's first query in this session"""
        return user_id not in self.conversation_history or len(self.conversation_history[user_id]) == 0

    def clean_response(self, response):
        """Clean the response to remove unwanted formatting"""
        # Remove common unwanted patterns
        unwanted_patterns = [
            r"USER QUESTION:.*?ASSISTANT:",
            r"User:.*?Assistant:",
            r"Question:.*?Answer:",
            r"USER QUESTION:.*",
            r"ASSISTANT:.*",
            r"User previously asked:.*",
            r"You previously responded:.*"
        ]
        
        cleaned = response
        for pattern in unwanted_patterns:
            cleaned = re.sub(pattern, "", cleaned, flags=re.DOTALL | re.IGNORECASE)
        
        # Clean up extra whitespace and newlines
        cleaned = re.sub(r'\n+', '\n', cleaned)
        cleaned = cleaned.strip()
        
        return cleaned

    def get_user_data(self, user_id):
        """Helper method to fetch and consolidate user data."""
        if users_df is None or symptom_logs_df is None:
            return None, None

        try:
            user_profile = users_df.loc[user_id].to_dict()
        except KeyError:
            user_profile = None

        try:
            user_logs = symptom_logs_df.loc[user_id].to_dict()
        except KeyError:
            user_logs = None

        print("USER_PROFILE:", user_profile)
        print("USER_LOGS:", user_logs)
        return user_profile, user_logs

    def run_basic_query_agent(self, user_query, user_id):
        """
        Dedicated method to run ONLY the BasicQueryAgent.
        """
        print(f"Orchestrator: Directly routing to BasicQueryAgent for user '{user_id}'.")
        user_profile, user_logs = self.get_user_data(user_id)
        
        # Get conversation context and first query status
        conversation_context = self.get_conversation_context(user_id)
        is_first = self.is_first_query(user_id)
        
        # Pass context to the agent
        response = self.basic_query_agent.run(
            user_query=user_query,
            user_profile=user_profile,
            user_logs=user_logs,
            conversation_context=conversation_context,
            is_first_query=is_first
        )
        
        # Clean the response
        response = self.clean_response(response)
        
        # Save this conversation exchange
        self.save_conversation_exchange(user_id, user_query, response)
        
        return response
    
    def _categorize_query(self, query):
        """Internal method for LLM-based categorization."""
        prompt = f"""You are an intelligent query categorization system for a menopause health and wellness assistant. 
        You are provided with User Query: "{query}"
        You have to categorize it into one of the following categories:

        1. BASIC_QUERY: General questions about menopause symptoms, causes, stages, general information, or educational content about menopause
        2. CONSULTATION: Questions seeking medical advice, symptom diagnosis, treatment recommendations, medication inquiries, or health-related inquiries
        3. DIET: Questions about diet recommendations, nutrition, foods to eat/avoid, meal planning, supplements, weight management, or dietary recommendations for menopause
        4. EXERCISE: Questions about physical activity, workout routines, fitness plans, specific exercises, or physical movement recommendations for menopause

        # MUST FOLLOW: Please respond in one word only- BASIC_QUERY, CONSULTATION, DIET, or EXERCISE
        FOR EXAMPLE
        User Query: "What are the symptoms of menopause?"
        Response: BASIC_QUERY 
        
        Based on the content and context of this query, respond with ONLY the category name (BASIC_QUERY, CONSULTATION, DIET, or EXERCISE)."""
        response = self.llm.invoke(prompt)
        return response.content.strip().upper()

    def run_categorization_pipeline(self, query, user_id):
        """
        Main pipeline that categorizes first, then routes.
        """
        raw_category_response = self._categorize_query(query)
        print("########", raw_category_response, "########")
        final_category = "BASIC_QUERY"
        if "CONSULTATION" in raw_category_response: final_category = "CONSULTATION"
        elif "DIET" in raw_category_response: final_category = "DIET"
        elif "EXERCISE" in raw_category_response: final_category = "EXERCISE"
        
        print(f"Orchestrator: Categorized as '{final_category}'. Routing...")
        
        user_profile, user_logs = self.get_user_data(user_id)
        conversation_context = self.get_conversation_context(user_id)
        is_first = self.is_first_query(user_id)

        # Route to the correct agent with context
        if final_category == "DIET":
            response = self.diet_agent.run(
                user_query=query, 
                user_profile=user_profile, 
                user_logs=user_logs,
                conversation_context=conversation_context,
                is_first_query=is_first
            )
        elif final_category == "EXERCISE":
            response = self.exercise_agent.run(
                user_query=query, 
                user_profile=user_profile, 
                user_logs=user_logs,
                conversation_context=conversation_context,
                is_first_query=is_first
            )
        elif final_category == "CONSULTATION":
            response = self.consultation_agent.run(
                user_query=query, 
                user_profile=user_profile, 
                user_logs=user_logs,
                conversation_context=conversation_context,
                is_first_query=is_first
            )
        else: # BASIC_QUERY
            response = self.basic_query_agent.run(
                user_query=query, 
                user_profile=user_profile, 
                user_logs=user_logs,
                conversation_context=conversation_context,
                is_first_query=is_first
            )
        
        # Extract response text from agent output
        if isinstance(response, dict) and 'output' in response:
            response_text = response['output']
        else:
            response_text = str(response)
        
        # Clean the response to remove unwanted formatting
        response_text = self.clean_response(response_text)
        
        # Save this conversation exchange
        self.save_conversation_exchange(user_id, query, response_text)
        
        return response_text
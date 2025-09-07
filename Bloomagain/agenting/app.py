from flask import Flask, request, jsonify, render_template
import os
import sys
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# Add the agents directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'agents'))

from agents.orchestrator import Orchestrator

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Initialize Gemini LLM
google_api_key = os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=google_api_key,
    temperature=0.1,  # Lower temperature for more focused responses
    max_output_tokens=150,
    stop=[
        "Human:", 
        "Observation",
        "USER QUESTION:",
        "ASSISTANT:",
        "User:",
        "Assistant:"
    ],
)

# Initialize orchestrator
orchestrator = Orchestrator(llm)

@app.route('/')
def home():
    """Render the main page with a query input form"""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Process user query through orchestrator for intelligent routing"""       
    try:
        data = request.get_json()
        
        # Original validation logic
        if not data or 'query' not in data or 'user_id' not in data:
            return jsonify({'error': 'Request must include "query" and "user_id"'}), 400
        
        user_query = data['query'].strip()
        user_id = data['user_id'].strip()

        if not user_query or not user_id:
            return jsonify({'error': 'Empty query or user_id provided'}), 400
        
        print(f"Processing orchestration for user '{user_id}': {user_query}")
        result = orchestrator.run_categorization_pipeline(user_query, user_id)
        print(f"Orchestrator result: {result}")

        if isinstance(result, dict) and 'output' in result:
            response_text = result['output']
        else:
            response_text = str(result)
        
        return jsonify({
            'user_id': user_id,
            'query': user_query,
            'response': response_text,
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error processing chat query: {str(e)}")
        return jsonify({
            'error': f'Server error: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/basicquery', methods=['POST'])
def basicquery():
    """
    Processes a basic query directly, bypassing categorization.
    """
    try:
        data = request.get_json()
        # ... (your validation logic for user_id and query is correct)
        if not data or 'query' not in data or 'user_id' not in data:
            return jsonify({'error': 'Request must include "query" and "user_id"'}), 400
        
        user_query = data['query'].strip()
        user_id = data['user_id'].strip()

        if not user_query or not user_id:
            return jsonify({'error': 'Empty query or user_id provided'}), 400
        
        print(f"Processing dedicated basic query for user '{user_id}': {user_query}")
        
        # --- KEY CHANGE ---
        # Call the new dedicated method in the orchestrator
        result = orchestrator.run_basic_query_agent(user_query=user_query, user_id=user_id)
        
        print(f"Final agent result: {result}")
        
        response_text = str(result)
        
        return jsonify({
            'user_id': user_id,
            'query': user_query,
            'response': response_text,
            'category': 'BASIC_QUERY', # Always correct for this endpoint
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error processing basic query: {str(e)}")
        return jsonify({'error': 'An internal server error occurred.'}), 500

        

@app.route('/consultation', methods=['POST'])
def consultation():
    """Process consultation-related queries directly through consultation agent"""
    try:
        # Get the query from request
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({
                'error': 'No query provided',
                'status': 'error'
            }), 400
        
        user_query = data['query'].strip()
        if not user_query:
            return jsonify({
                'error': 'Empty query provided',
                'status': 'error'
            }), 400
        
        print(f"Processing consultation query: {user_query}")
        
        # Process query directly through exercise agent
        result = orchestrator.consultation_agent.run(user_query)
        
        print(f"Consultation agent result: {result}")
        
        # Handle different result formats from agents
        if isinstance(result, dict) and 'output' in result:
            response_text = result['output']
        else:
            response_text = str(result)
        
        return jsonify({
            'query': user_query,
            'response': response_text,
            'category': 'CONSULTATION',
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error processing consultation query: {str(e)}")
        return jsonify({
            'error': f'Server error: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/exercise', methods=['POST'])
def exercise():
    """Process exercise-related queries directly through exercise agent"""
    try:
        # Get the query from request
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({
                'error': 'No query provided',
                'status': 'error'
            }), 400
        
        user_query = data['query'].strip()
        if not user_query:
            return jsonify({
                'error': 'Empty query provided',
                'status': 'error'
            }), 400
        
        print(f"Processing exercise query: {user_query}")
        
        # Process query directly through exercise agent
        result = orchestrator.exercise_agent.run(user_query)
        
        print(f"Exercise agent result: {result}")
        
        # Handle different result formats from agents
        if isinstance(result, dict) and 'output' in result:
            response_text = result['output']
        else:
            response_text = str(result)
        
        return jsonify({
            'query': user_query,
            'response': response_text,
            'category': 'EXERCISE',
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error processing exercise query: {str(e)}")
        return jsonify({
            'error': f'Server error: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/diet', methods=['POST'])
def diet():
    """Process diet-related queries directly through diet agent"""
    try:
        # Get the query from request
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({
                'error': 'No query provided',
                'status': 'error'
            }), 400
        
        user_query = data['query'].strip()
        if not user_query:
            return jsonify({
                'error': 'Empty query provided',
                'status': 'error'
            }), 400
        
        print(f"Processing diet query: {user_query}")
        
        # Process query directly through diet agent
        result = orchestrator.diet_agent.run(user_query)
        
        print(f"Diet agent result: {result}")
        
        # Handle different result formats from agents
        if isinstance(result, dict) and 'output' in result:
            response_text = result['output']
        else:
            response_text = str(result)
        
        return jsonify({
            'query': user_query,
            'response': response_text,
            'category': 'DIET',
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error processing diet query: {str(e)}")
        return jsonify({
            'error': f'Server error: {str(e)}',
            'status': 'error'
        }), 500

if __name__ == '__main__':
    # Create templates directory if it doesn't exist
    if not os.path.exists('templates'):
        os.makedirs('templates')
    
    print("Starting Menopause Consultation API...")
    print("Available endpoints:")
    print("- GET  /           : Main page with query form")
    print("- POST /chat       : General queries (routed through orchestrator)")
    print("- POST /exercise   : Exercise-specific queries")
    print("- POST /basicquery : Basic queries")
    print("- POST /consultation: Consultation-specific queries")
    print("- POST /diet       : Diet-specific queries")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
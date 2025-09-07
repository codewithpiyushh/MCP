# MCP - Model Context Protocol Project 

A comprehensive full-stack application featuring a React Native mobile app with AI-powered health consultation, secure authentication, and intelligent backend services.

##  Project Overview

MCP (Model Context Protocol) is a modern health and wellness platform that combines:
- **Mobile App (Bloomagain)**: React Native app with AI-powered health consultations
- **Backend Services**: Node.js/Express API with MongoDB integration
- **AI Agent System**: Python Flask backend with LangChain and Google Gemini AI
- **Secure Authentication**: Enterprise-grade authentication powered by Descope

##  Project Structure

```
MCP/
├── Bloomagain/                 # React Native Mobile App
│   ├── app/                    # Expo Router pages
│   ├── components/             # Reusable UI components
│   ├── constants/              # App constants and configurations
│   ├── assets/                 # Images, icons, and media files
│   ├── agenting/               # Python AI backend
│   │   ├── agents/             # Specialized AI agents
│   │   ├── data/               # User data and configurations
│   │   └── whatsapp_connection/ # WhatsApp integration
│   └── interfaces/             # TypeScript type definitions
├── backend/                    # Node.js API server
├── services/                   # Shared service utilities
└── myapp/                      # Legacy components (merged)
```

##  Authentication with Descope

### Why Descope?

We chose **Descope** as our authentication provider because it offers:

-  **Enterprise Security**: Advanced security features with zero security debt
-  **No-Code Flows**: Visual drag-and-drop authentication flow builder
-  **Multi-Platform Support**: Seamless integration across React Native, Node.js, and web
-  **Social Login**: Built-in support for Google, Facebook, GitHub, and more
-  **Developer Experience**: Simple SDK integration with comprehensive documentation
-  **Analytics**: Built-in user analytics and session management


### Authentication Features

-  **Secure Login/Signup**: Email/password and social authentication
-  **Session Management**: Automatic token refresh and validation
-  **Protected Routes**: Route-level authentication guards
-  **User Profiles**: Comprehensive user data management
-  **Multi-Factor Authentication**: Optional MFA for enhanced security
-  **Password Recovery**: Self-service password reset flows

##  AI-Powered Features

### Intelligent Health Agents

Our AI system includes specialized agents for:

1. **Basic Query Agent**: General health information and guidance
2. **Diet Agent**: Personalized nutrition recommendations
3. **Exercise Agent**: Fitness plans and workout suggestions
4. **Consultation Agent**: Medical consultation and symptom analysis
5. **Orchestrator Agent**: Coordinating between different AI services

### Technology Stack
- **LangChain**: Advanced AI orchestration and prompt management
- **Google Gemini AI**: Cutting-edge language model for responses
- **ChromaDB**: Vector database for intelligent information retrieval
- **Python Flask**: Lightweight API framework for AI services

##  Mobile App Features

### Core Functionality
-  **Home Dashboard**: Personalized health insights and quick actions
-  **AI Chat Interface**: Natural language health consultations
-  **Calendar Integration**: Appointment scheduling and health tracking
-  **Consultation Booking**: Direct access to healthcare professionals

### UI/UX Highlights
-  **NativeWind Styling**: Tailwind CSS for React Native
-  **Responsive Design**: Optimized for all screen sizes
-  **Modern Interface**: Clean, intuitive user experience
-  **Performance Optimized**: Fast loading and smooth animations

##  Technology Stack

### Frontend
- **React Native** 0.81.1 - Cross-platform mobile development
- **Expo SDK** ~53.0.20 - Development platform and tools
- **TypeScript** - Type-safe JavaScript development
- **NativeWind** - Tailwind CSS for React Native
- **Expo Router** - File-based routing system

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Descope SDK** - Authentication and user management

### AI/ML Services
- **Python** 3.11+ - Programming language
- **Flask** - Micro web framework
- **LangChain** - AI application development framework
- **Google Gemini AI** - Large language model
- **ChromaDB** - Vector database

### Development Tools
- **Jest** - JavaScript testing framework
- **ESLint** - Code linting and formatting
- **Git** - Version control system
- **VS Code** - Development environment

##  Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.11 or higher)
- Expo CLI
- MongoDB instance
- Descope account and project setup



##  Screenshots & Demo

### Authentication Flow
<img width="738" height="1600" alt="Bloom (1)" src="https://github.com/user-attachments/assets/92049c3d-7b7a-4e01-8ee8-a0f78fdc748d" />



### Main Dashboard

![WhatsApp Image 2025-09-04 at 01 34 32_e4e87e55](https://github.com/user-attachments/assets/caf8e3e3-ec73-4ef9-b4ff-0f23375df9b5)


### AI Chat Interface
![WhatsApp Image 2025-09-04 at 01 34 33_7c956781](https://github.com/user-attachments/assets/a8d8e436-87b1-4350-8efa-0e3583fbc734)


### Calendar & Booking
![WhatsApp Image 2025-09-04 at 01 34 32_7bb52fd8](https://github.com/user-attachments/assets/81e41f64-0be9-4849-a002-eb140a555449)


##  Video Demos



https://github.com/user-attachments/assets/4530931a-de06-4847-bc48-5f7ae41ad21f



##  Acknowledgments

- **Descope** for providing enterprise-grade authentication solutions
- **Google** for the powerful Gemini AI capabilities
- **Expo Team** for the excellent React Native development platform
- **LangChain** for AI application development framework
- **React Native Community** for continuous innovation and support


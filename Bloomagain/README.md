# Bloom - Menopause Wellness Companion 🌸

A comprehensive React Native/Expo application designed to support women through their menopause journey with AI-powered guidance, symptom tracking, and wellness features.

## 🚀 Features

### 🤖 AI-Powered Assistant (BloomAI)
- Intelligent chatbot powered by Google Gemini AI
- Specialized agents for diet, exercise, consultation, and general queries
- Personalized responses based on user profiles and symptom logs
- Real-time conversation with context awareness

### 📊 Health & Wellness Tracking
- **Symptom Calendar**: Track hot flashes, mood changes, sleep patterns, and more
- **Health Insights**: Visual insights into your wellness journey
- **Progress Monitoring**: Monitor improvements over time

### 🔐 Secure Authentication
- Enterprise-grade authentication powered by Descope
- Beautiful onboarding flow with gradient UI
- Session management and secure API calls

### 📱 Modern User Interface
- **NativeWind (Tailwind CSS)** for consistent styling
- **Video backgrounds** and rich media content
- **Tab-based navigation** with intuitive design
- **Responsive design** for all screen sizes

## 🏗️ Architecture

### Frontend (React Native/Expo)
```
Bloomagain/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── home.tsx         # Home screen with insights
│   │   ├── bloomai.tsx      # AI chat interface
│   │   ├── calendar.tsx     # Symptom tracking
│   │   └── consult.tsx      # Consultation features
│   ├── auth.tsx             # Authentication screen
│   ├── _layout.tsx          # Root layout with AuthProvider
│   └── index.tsx            # Entry point
├── AuthContext.tsx          # Authentication context
├── agenting/                # Python AI backend
└── assets/                  # Images, videos, fonts
```

### Backend Services
```
backend/                     # Node.js Express server
├── middleware/              # Authentication middleware
├── routes/                  # API routes
│   ├── auth.js             # MongoDB authentication
│   └── descopeAuth.js      # Descope authentication
└── index.js                # Main server file

services/
└── api.js                  # API service layer
```

### AI Backend (Python Flask)
```
agenting/
├── app.py                   # Flask server
├── agents/                  # Specialized AI agents
│   ├── orchestrator.py     # Query routing
│   ├── basic_query.py      # General information
│   ├── consultation.py     # Medical guidance
│   ├── diet.py             # Nutrition advice
│   └── exercise.py         # Fitness recommendations
└── data/                    # User data and training sets
```

## 🛠️ Tech Stack

### Frontend
- **React Native** 0.81.1
- **Expo** ~53.0.20 with Expo Router
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS for React Native)
- **Descope React Native SDK** for authentication

### Backend
- **Node.js** with Express.js
- **MongoDB** for user data
- **Descope Node.js SDK** for session validation
- **Python Flask** for AI services
- **LangChain** with Google Gemini AI

### Key Dependencies
- `@descope/react-native-sdk`: Authentication
- `expo-router`: File-based routing
- `react-native-linear-gradient`: Beautiful gradients
- `expo-av`: Video and audio support
- `react-native-calendars`: Calendar components
- `nativewind`: Styling with Tailwind CSS

## 📦 Installation & Setup

### Prerequisites
- Node.js (>= 20)
- Python 3.8+
- Expo CLI
- React Native development environment

### 1. Install Dependencies
```bash
cd Bloomagain
npm install

# Install Python dependencies for AI backend
cd agenting
pip install -r requirements.txt
```

### 2. Environment Configuration

#### Backend (.env)
```bash
cd ../backend
cp .env.example .env
# Edit .env with your configuration:
# - DESCOPE_PROJECT_ID
# - MONGODB_URI
# - GOOGLE_API_KEY (for AI features)
```

### 3. Start the Services

#### Start Backend Server
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

#### Start AI Backend (Python)
```bash
cd Bloomagain/agenting
python app.py
# AI server runs on http://localhost:5000
```

#### Start React Native App
```bash
cd Bloomagain
npm start
# Choose platform: Android, iOS, or Web
```

## 🎯 Usage

1. **Authentication**: Users sign up/login through Descope's secure flow
2. **Onboarding**: Beautiful welcome screen with app features
3. **Main App**: Tab-based navigation with:
   - **Home**: Health insights and educational content
   - **BloomAI**: Chat with AI assistant
   - **Calendar**: Track symptoms and patterns
   - **Consult**: Consultation and guidance features

## 🔐 Authentication Flow

1. User opens app → AuthProvider checks session
2. No session → Beautiful auth screen with Descope flow
3. User authenticates → Session stored securely
4. Authenticated → Access to main app features
5. API calls include session token for backend validation

## 🤖 AI Features

### Specialized Agents
- **Orchestrator**: Routes queries to appropriate agents
- **BasicQuery**: General menopause information
- **Consultation**: Medical guidance and advice
- **Diet**: Nutritional recommendations
- **Exercise**: Fitness and wellness tips

### Conversation Management
- Context-aware responses
- User profile integration
- Conversation history
- Personalized recommendations

## 📱 Screens Overview

### Authentication Screen
- Beautiful gradient design
- Descope integration
- User profile display when authenticated
- Secure session management

### Home Screen
- Video header with wellness content
- Health insights carousel
- Educational content grid
- Breaking taboos section

### BloomAI Screen
- Real-time chat interface
- AI-powered responses
- Session-aware API calls
- Conversation history

### Calendar Screen
- Symptom tracking interface
- Visual calendar display
- Pattern recognition
- Health trend analysis

## 🔧 Development

### Project Structure
The project follows Expo Router file-based routing:
- `app/` directory contains all screens
- `(tabs)/` for tab-based navigation
- `_layout.tsx` for layout configuration

### Adding New Features
1. Create new screen in `app/` directory
2. Add navigation in `(tabs)/_layout.tsx` if needed
3. Update types in `interfaces/` directory
4. Add API endpoints in backend routes

### Environment Variables
- `DESCOPE_PROJECT_ID`: Your Descope project ID
- `MONGODB_URI`: MongoDB connection string
- `GOOGLE_API_KEY`: For AI features

## 🚀 Deployment

### Mobile Apps
```bash
# Build for production
expo build:android
expo build:ios

# Or with EAS Build
eas build --platform android
eas build --platform ios
```

### Backend Services
- Deploy Node.js backend to your preferred cloud provider
- Deploy Python AI service separately
- Configure environment variables in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Create an issue on GitHub
- Contact the development team

---

**Bloom** - Empowering women through their menopause journey with technology, compassion, and understanding. 🌸

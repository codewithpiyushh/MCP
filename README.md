# Bloom 

Bloom is a personalized, multi-agent AI-driven app designed to support women through the menopause journey by providing symptom tracking, tailored health advice, emotional wellness tools, and direct healthcare connection—all with strong privacy and security.

---

## Features

- **Multi-Agent Intelligence**  
  Specialized AI agents powered by Google Gemini models work collaboratively to deliver expert guidance on symptoms, diet, exercise, and emotional health.

- **Personalized Symptom Tracking**  
  Users log symptoms, moods, and cycle data to receive tailored insights and trend visualization.

- **Holistic Wellbeing Support**  
  Exercise and meditation recommendations help manage physical discomfort and emotional stress.

- **Remote Healthcare Access**  
  AI agents enable booking of online consultations and sharing of detailed health reports with providers.

- **Multiplatform Access & Security**  
  Available on mobile, web, and WhatsApp with secure, seamless authentication powered by Descope, ensuring user privacy and compliance.

---

## Technology Stack

- **Mobile App:** React Native for cross-platform UI  
- **AI Backend:** Python Flask with LangChain and Google Gemini  
- **API Server:** Node.js with Express and MongoDB  
- **Authentication:** Descope for enterprise-grade security

---

## Why Bloom?

Bloom empowers women to take control of menopause with intelligent, confidential support—breaking stigma and improving quality of life through personalized, data-driven care and easy access to experts. It’s more than an app; it’s a compassionate companion.

---

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

## Authentication with Descope

### Why Descope?

We chose **Descope** as our authentication provider because it offers a powerful combination of security, flexibility, and developer-friendly features:

- **Enterprise-Grade Security:** Advanced protection mechanisms with zero security debt to keep user data safe.
- **No-Code Authentication Flows:** Visual drag-and-drop builder enabling quick customization of login/signup experiences without code.
- **Multi-Platform Support:** Seamless integration across React Native, Node.js, and web apps, ensuring consistent security everywhere.
- **Social Login Ready:** Out-of-the-box support for popular providers like Google, Facebook, GitHub, and more.
- **Developer Experience:** Easy-to-use SDKs with clear documentation for fast integration and maintenance.
- **Built-In Analytics:** User and session analytics to monitor authentication and security health.

### Authentication Features

- **Secure Login & Signup:** Support for email/password, social OAuth, magic links, OTP, and passkeys.
- **Session Management:** Automatic token renewal and validation to keep users securely logged in.
- **Protected Routes:** Route-level guards to restrict access based on authentication status.
- **Comprehensive User Profiles:** Manage detailed user data securely with update and linking capabilities.
- **Multi-Factor Authentication (MFA):** Optional MFA for extra layers of account protection.
- **Password Recovery:** Self-service flows enabling users to reset passwords safely and easily.

---

Descope’s flexible and robust system empowers Bloom to deliver a frictionless, secure authentication experience while complying with healthcare privacy and compliance needs.



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



## Screenshots & Demo

### Authentication Flow
<img width="300" alt="Authentication Flow" src="https://github.com/user-attachments/assets/92049c3d-7b7a-4e01-8ee8-a0f78fdc748d" />

### Main Interface Screens
<p float="left">
  <img src="https://github.com/user-attachments/assets/caf8e3e3-ec73-4ef9-b4ff-0f23375df9b5" width="250" alt="Main Dashboard"/>
  <img src="https://github.com/user-attachments/assets/a8d8e436-87b1-4350-8efa-0e3583fbc734" width="250" alt="AI Chat Interface"/>
  <img src="https://github.com/user-attachments/assets/81e41f64-0be9-4849-a002-eb140a555449" width="250" alt="Calendar & Booking"/>
</p>

##  Video Demos



https://github.com/user-attachments/assets/4530931a-de06-4847-bc48-5f7ae41ad21f



##  Acknowledgments

- **Descope** for providing enterprise-grade authentication solutions
- **Google** for the powerful Gemini AI capabilities
- **Expo Team** for the excellent React Native development platform
- **LangChain** for AI application development framework
- **React Native Community** for continuous innovation and support


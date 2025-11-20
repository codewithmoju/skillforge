# SkillForge 🎮

A gamified learning platform powered by AI that generates personalized learning roadmaps and interactive quizzes.

## ✨ Features

### 🎨 Beautiful Landing Page
- **Hero Section**: Eye-catching gradient backgrounds and animations
- **Feature Showcase**: Highlight key platform capabilities
- **Social Proof**: Display stats and testimonials
- **Clear CTAs**: Guide users to sign up and start learning

### 🔐 Complete Authentication System
- **Email/Password**: Traditional signup and login
- **Google Sign-In**: One-click OAuth authentication
- **Password Reset**: Secure email-based recovery
- **Protected Routes**: Dashboard only accessible to authenticated users

### 🗺️ Dynamic Roadmap Generation
- **AI-Powered**: Enter any topic and Gemini AI generates a structured, gamified learning path
- **Visual Progress**: Beautiful node-based visualization with progress tracking
- **Gamification**: Levels, XP, streaks, and achievement system
- **Interactive Lessons**: Click to complete lessons and unlock new modules

### 🧠 AI-Generated Quizzes
- **Smart Challenges**: AI creates contextual quizzes for each module
- **Instant Feedback**: Real-time answer validation with visual feedback
- **XP Rewards**: Earn bonus XP for passing quizzes (60%+ score)
- **Beautiful UI**: Smooth animations and engaging interface

### 🎨 Premium Design
- **Dark Mode**: Sleek, modern dark theme
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive**: Works beautifully on all devices
- **Glassmorphism**: Modern UI with depth and elegance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key
- Firebase project (optional, for auth)

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd skillforge
   npm install
   ```

2. **Set up environment variables**:
   
   Create a `.env.local` file in the root directory:
   ```env
   # Gemini AI (Required for roadmap generation)
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Firebase (Optional, for authentication)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Get your Gemini API key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env.local` file

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### First Time Setup

1. Open [http://localhost:3000](http://localhost:3000)
2. You'll see the **beautiful landing page**
3. Click **"Get Started"** to create an account
4. Choose to sign up with:
   - **Email & Password** (enter name, email, password)
   - **Google Sign-In** (one-click authentication)

### Access the Dashboard

Once authenticated, you can access:
- **Dashboard**: Overview of your progress
- **Roadmap**: Generate and follow learning paths
- **Projects**: Build real-world projects
- **Quizzes**: Test your knowledge

### Generate a Learning Roadmap

1. Navigate to the **Roadmap** page (or click from landing page)
2. Enter a topic you want to learn (e.g., "Machine Learning", "React", "Cooking")
3. Click **"New Path"** or press Enter
4. Watch as AI generates your personalized learning journey!

### Complete Lessons

1. Click on any **active** (cyan) or **completed** (green) node
2. View the module details in the right panel
3. Click on lessons to mark them as complete
4. Earn **50 XP** per lesson completed

### Take Quizzes

1. Select a module from your roadmap
2. Click **"Take Quiz Challenge"**
3. Answer 3 AI-generated questions
4. Score 60%+ to earn **100 bonus XP**!

### Track Your Progress

- **XP Bar**: See your total experience points
- **Level**: Your current skill level
- **Streak**: Days of consecutive learning
- **Progress Bars**: Visual feedback on module completion

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand (with persistence)
- **Animations**: Framer Motion
- **AI**: Google Gemini 1.5 Flash
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore (ready)
- **Icons**: Lucide React

## 📁 Project Structure

```
skillforge/
├── app/
│   ├── api/
│   │   ├── generate-roadmap/    # AI roadmap generation
│   │   └── generate-quiz/       # AI quiz generation
│   ├── roadmap/                 # Main roadmap page
│   └── layout.tsx               # Root layout
├── components/
│   ├── features/
│   │   └── QuizModal.tsx        # Quiz interface
│   ├── layout/
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   └── TopBar.tsx           # Top navigation with auth
│   └── ui/
│       ├── Button.tsx           # Reusable button
│       ├── Card.tsx             # Card component
│       ├── Modal.tsx            # Modal wrapper
│       └── ProgressBar.tsx      # Progress indicator
├── lib/
│   ├── hooks/
│   │   └── useAuth.ts           # Firebase auth hook
│   ├── firebase.ts              # Firebase config
│   ├── store.ts                 # Zustand state management
│   └── utils.ts                 # Utility functions
└── .env.local                   # Environment variables
```

## 🎯 Roadmap Features

### Current Features ✅
- Dynamic AI roadmap generation
- Interactive lesson tracking
- AI-powered quizzes
- XP and leveling system
- Firebase authentication
- Local storage persistence
- Beautiful animations

### Coming Soon 🚧
- Firestore cloud sync
- Social features (share roadmaps)
- Detailed lesson content
- Code challenges
- Achievements and badges
- Learning analytics
- Mobile app

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for learning or building your own version!

## 🙏 Acknowledgments

- **Google Gemini** for powerful AI capabilities
- **Vercel** for Next.js framework
- **Firebase** for authentication infrastructure
- **Framer** for smooth animations

---

**Built with ❤️ using AI-powered development**

Need help? Check the code comments or create an issue!

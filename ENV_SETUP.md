# Example Environment Variables for SkillForge

# ============================================
# GEMINI AI (REQUIRED)
# ============================================
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# ============================================
# FIREBASE (OPTIONAL - For Authentication)
# ============================================
# Create a Firebase project at: https://console.firebase.google.com/
# Then go to Project Settings > General > Your apps > Web app

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# ============================================
# SETUP INSTRUCTIONS
# ============================================
# 1. Copy this file to .env.local
# 2. Replace all placeholder values with your actual credentials
# 3. Restart your development server (npm run dev)
# 4. The app will work with just GEMINI_API_KEY
#    Firebase is optional for authentication features

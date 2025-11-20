# Firebase Setup Guide for SkillForge

This guide will walk you through setting up Firebase for SkillForge, including Authentication and Firestore Database.

## 📋 Required Firebase Services

For SkillForge to work properly, you need to enable:
- ✅ **Authentication** (Email/Password + Google Sign-In)
- ✅ **Firestore Database** (for storing user data and roadmaps)

## 🚀 Step-by-Step Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `SkillForge` (or your preferred name)
4. **Google Analytics**: Optional (you can disable it for faster setup)
5. Click **"Create project"** and wait for it to finish

### 2. Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `SkillForge Web`
3. **Firebase Hosting**: Leave unchecked (we're using Next.js)
4. Click **"Register app"**
5. **Copy the configuration** - you'll need this for `.env.local`

Your config will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "skillforge-xxxxx.firebaseapp.com",
  projectId: "skillforge-xxxxx",
  storageBucket: "skillforge-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 3. Enable Authentication

#### Email/Password Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. **Enable** the first toggle (Email/Password)
6. Leave "Email link (passwordless sign-in)" **disabled**
7. Click **"Save"**

#### Google Sign-In

1. Still in **"Sign-in method"** tab
2. Click on **"Google"**
3. **Enable** the toggle
4. Select a **Project support email** (your email)
5. Click **"Save"**

### 4. Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. **Security rules**: Select **"Start in test mode"** (we'll update this later)
4. **Location**: Choose the closest region to your users
5. Click **"Enable"**

#### Update Security Rules (Important!)

After creating the database, update the security rules:

1. Go to **Firestore Database** → **Rules** tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own roadmaps
    match /roadmaps/{roadmapId} {
      allow read, write: if request.auth != null && 
                            resource.data.userId == request.auth.uid;
    }
    
    // Leaderboard - read by all, write only by owner
    match /leaderboard/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

### 5. Configure Your App

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add your Firebase configuration:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI (Required)
GEMINI_API_KEY=your_gemini_api_key
```

3. Replace all `your_*` placeholders with actual values from step 2
4. **Restart your development server**: `npm run dev`

## ✅ Verification

### Test Authentication

1. Open your app at `http://localhost:3000`
2. Click **"Get Started"** in the top right
3. Try signing up with email/password
4. Try logging in with Google
5. Check Firebase Console → **Authentication** → **Users** to see your account

### Test Firestore (Optional)

1. In Firebase Console, go to **Firestore Database**
2. You should see collections appear when users save data
3. Check that security rules are working (users can only access their own data)

## 🔒 Security Best Practices

### For Production

1. **Update Firestore Rules**: Never use "test mode" in production
2. **Enable App Check**: Protect your backend from abuse
3. **Set up Authorized Domains**: 
   - Go to **Authentication** → **Settings** → **Authorized domains**
   - Add your production domain
4. **API Key Restrictions**: 
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Restrict your API key to specific domains

### Environment Variables

- ✅ **DO**: Keep `.env.local` in `.gitignore`
- ✅ **DO**: Use different Firebase projects for dev/prod
- ❌ **DON'T**: Commit API keys to version control
- ❌ **DON'T**: Share your `.env.local` file

## 📊 Firestore Data Structure

SkillForge uses this structure:

```
users/
  {userId}/
    - name: string
    - email: string
    - xp: number
    - level: number
    - streak: number
    - createdAt: timestamp

roadmaps/
  {roadmapId}/
    - userId: string
    - topic: string
    - definitions: array
    - progress: object
    - createdAt: timestamp
```

## 🆘 Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure all environment variables are set correctly
- Restart your development server after adding `.env.local`

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you're logged in
- Verify the user ID matches the document path

### Google Sign-In not working
- Check that Google is enabled in Authentication → Sign-in method
- Verify your domain is in Authorized domains
- Make sure you selected a support email

### Email/Password sign-up fails
- Check that Email/Password is enabled in Firebase Console
- Verify password is at least 6 characters
- Check browser console for specific error messages

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## 🎉 You're All Set!

Your Firebase backend is now configured and ready to use with SkillForge. Users can:
- ✅ Sign up with email/password
- ✅ Login with Google
- ✅ Reset their password
- ✅ Have their data securely stored in Firestore

Happy learning! 🚀

# Quick Firestore Rules Deployment Guide

## Step 1: List your Firebase projects
```powershell
firebase projects:list
```

## Step 2: Set the active project
Replace `your-project-id` with your actual project ID from the list:
```powershell
firebase use your-project-id
```

Or if you want to add an alias:
```powershell
firebase use --add
# Then select your project and give it an alias (e.g., "production")
```

## Step 3: Deploy the rules
```powershell
firebase deploy --only firestore:rules
```

## Step 4: Verify deployment
Check the Firebase Console:
1. Go to https://console.firebase.google.com
2. Select your project
3. Navigate to Firestore Database → Rules
4. Confirm the rules are updated

## Alternative: Deploy via Firebase Console (Manual)
If CLI doesn't work:
1. Go to Firebase Console → Firestore → Rules
2. Copy contents from `firestore.rules`
3. Paste into the editor
4. Click "Publish"

## Troubleshooting
- **Not logged in?** Run: `firebase login`
- **Wrong project?** Run: `firebase use your-project-id`
- **Permission denied?** Check Firebase project permissions in console

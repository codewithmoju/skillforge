# Firestore Rules Deployment Guide

## Prerequisites
- Firebase CLI installed
- Firebase project configured
- Admin access to Firebase project

## Installation

### 1. Install Firebase CLI (if not already installed)
```powershell
npm install -g firebase-tools
```

### 2. Login to Firebase
```powershell
firebase login
```

### 3. Initialize Firebase (if not done)
```powershell
firebase init
```
Select:
- Firestore (for rules and indexes)
- Choose your existing project  
- Accept default firestore.rules and firestore.indexes.json

## Deploying Firestore Rules

### Deploy Rules Only
```powershell
firebase deploy --only firestore:rules
```

### Deploy Rules and Indexes
```powershell
firebase deploy --only firestore
```

### Deploy All Firebase Resources
```powershell
firebase deploy
```

## Verify Rules Deployment

### 1. Via Firebase Console
1. Go to https://console.firebase.google.com
2. Select your project
3. Navigate to Firestore Database → Rules
4. Verify the rules match your local `firestore.rules` file

### 2. Via Firebase CLI
```powershell
firebase firestore:rules:list
```

## Testing Rules Locally

### Option 1: Firebase Emulator
```powershell
# Install emulators
firebase init emulators

# Start Firestore emulator
firebase emulators:start --only firestore
```

### Option 2: Rules Playground
1. Go to Firebase Console → Firestore → Rules
2. Click "Rules Playground"
3. Test read/write operations with different user contexts

## Common Issues

### Issue: "Firestore rules not updating"
**Solution:** Clear browser cache and wait 1-2 minutes for rules to propagate

### Issue: "Permission denied" errors
**Solution:** 
1. Check if user is authenticated
2. Verify the rule conditions match your data structure
3. Use Firebase Console Rules Playground to debug

### Issue: "Command 'firebase' not found"
**Solution:** Install Firebase CLI globally:
```powershell
npm install -g firebase-tools
```

## Important Notes

### ⚠️ Security Checklist
- [ ] Never use `allow read, write: if true` in production
- [ ] Always validate user authentication with `request.auth != null`
- [ ] Implement field-level validation for sensitive data
- [ ] Test rules with different user roles before deployment
- [ ] Monitor Firestore usage for unusual patterns

### 📝 Rules File Location
The rules file is located at: `c:\Edumate_AI\skillforge\firestore.rules`

### 🔄 Continuous Deployment
Consider setting up automatic deployment via GitHub Actions:
```yaml
name: Deploy Firestore Rules
on:
  push:
    branches: [main]
    paths: ['firestore.rules']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: w9jds/firebase-action@master
        with:
          args: deploy --only firestore:rules
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Next Steps

After deploying rules:
1. ✅ Test authentication flow
2. ✅ Verify protected routes work
3. ✅ Test CRUD operations for each collection
4. ✅ Monitor Firebase Console for security alerts
5. ✅ Set up usage alerts for quota monitoring

## Support
- Firebase Documentation: https://firebase.google.com/docs/firestore/security/get-started
- Firebase Support: https://firebase.google.com/support

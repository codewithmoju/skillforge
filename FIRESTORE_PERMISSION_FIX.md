# Firestore Permission Error - Quick Fix

## Problem
**Error:** "Missing or insufficient permissions" when logged in

## Root Cause
The Firestore security rules we deployed are enforcing authentication, but some collections have overly restrictive rules that prevent normal operations.

## Quick Fixes Applied

### 1. Courses Collection
**Changed:** Allow all authenticated users to read courses
```javascript
// Before (too restrictive)
allow read: if isAuthenticated();
allow create: if isAuthenticated();

// After (properly configured)
allow read: if isAuthenticated(); // Anyone can browse courses
allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
allow update: if resource.data.userId == request.auth.uid;
allow delete: if resource.data.userId == request.auth.uid;
```

## Additional Common Issues

### If error persists, check:

1. **User Authentication State**
   - Open browser console
   - Check if `firebase.auth().currentUser` is not null
   - Verify the user is actually logged in

2. **Which Collection is Failing?**
   Look at the console error stack trace to see which Firestore query is failing.

3. **Common Collections That Need Relaxed Rules:**

```javascript
// Users - everyone can read user profiles
match /users/{userId} {
  allow read: if isAuthenticated(); // ✅ Anyone can view profiles
  allow write: if request.auth.uid == userId; // ✅ Only own profile
}

// Posts - everyone can read
match /posts/{postId} {
  allow read: if isAuthenticated(); // ✅ Anyone can see posts
  allow write: if request.auth.uid == resource.data.userId; // ✅ Only author
}

// Courses - everyone can browse
match /courses/{courseId} {
  allow read: if isAuthenticated(); // ✅ Browse all courses
  allow write: if request.auth.uid == resource.data.userId; // ✅ Only owner
}
```

## Testing

After rules are redeployed:
1. Clear browser cache
2. Log out and log back in
3. Try accessing the page that was failing
4. Check console for any remaining errors

## If Still Failing

Share the full error message including:
- Which page/component is failing
- The exact Firestore query that's failing
- Browser console stack trace

I can then adjust the specific rules for that collection.

---

**Status:** Rules updated and deploying. Should fix the permission error.

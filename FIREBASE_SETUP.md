# Firebase Configuration Guide

## What Has Been Configured

Firebase has been successfully installed and configured in your Angular application with:

1. **Firebase SDK** - Core Firebase library
2. **@angular/fire** - Official Angular library for Firebase
3. **Firebase Authentication** - User authentication service
4. **Cloud Firestore** - NoSQL cloud database

## Files Modified/Created

- `src/environments/environment.ts` - Development Firebase config
- `src/app/app.config.ts` - Firebase providers added
- `src/app/services/auth.service.ts` - Authentication service
- `src/app/services/firestore.service.ts` - Firestore database service

## Usage Examples

### Authentication Service

Import and inject the AuthService in your components:

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export class LoginComponent {
  private authService = inject(AuthService);

  // Sign up a new user
  async signUp(email: string, password: string) {
    try {
      const result = await this.authService.signUp(email, password);
      console.log('User created:', result.user);
    } catch (error) {
      console.error('Sign up error:', error);
    }
  }

  // Sign in existing user
  async signIn(email: string, password: string) {
    try {
      const result = await this.authService.signIn(email, password);
      console.log('Signed in:', result.user);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  }

  // Sign out
  async logout() {
    await this.authService.logout();
  }

  // Subscribe to auth state changes
  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        console.log('User is logged in:', user);
      } else {
        console.log('User is logged out');
      }
    });
  }
}
```

### Firestore Service

Import and inject the FirestoreService in your components:

```typescript
import { Component, inject } from '@angular/core';
import { FirestoreService } from './services/firestore.service';

interface Member {
  id?: string;
  name: string;
  email: string;
}

export class MembersComponent {
  private firestoreService = inject(FirestoreService);
  members$ = this.firestoreService.getCollection<Member>('members');

  // Add a new member
  async addMember(name: string, email: string) {
    const memberData = { name, email, createdAt: new Date() };
    await this.firestoreService.addDocument('members', memberData);
  }

  // Update a member
  async updateMember(id: string, data: Partial<Member>) {
    await this.firestoreService.updateDocument('members', id, data);
  }

  // Delete a member
  async deleteMember(id: string) {
    await this.firestoreService.deleteDocument('members', id);
  }

  // Get single member
  getMember(id: string) {
    return this.firestoreService.getDocument<Member>('members', id);
  }
}
```

## Firebase Console Setup

Make sure you have enabled the following in your Firebase Console:

### Enable Authentication
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **moneytree-3f0eb**
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Email/Password** provider
5. (Optional) Enable other providers like Google, Facebook, etc.

### Enable Firestore Database
1. Navigate to **Firestore Database**
2. Click **Create database**
3. Choose production mode or test mode:
   - **Test mode**: For development (open for 30 days)
   - **Production mode**: Add security rules

### Security Rules Example (Firestore)

For development (test mode):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

For production (authenticated users only):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{memberId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == memberId;
    }
  }
}
```

## Next Steps

1. Enable Authentication providers in Firebase Console
2. Create Firestore database in Firebase Console
3. Set up security rules for your database
4. Start using the AuthService and FirestoreService in your components
5. Build authentication pages (login, signup, profile)
6. Create data management pages using Firestore

## Available Service Methods

### AuthService
- `signUp(email, password)` - Create new user
- `signIn(email, password)` - Sign in user
- `logout()` - Sign out user
- `getCurrentUser()` - Get current user object
- `user$` - Observable of auth state changes

### FirestoreService
- `getCollection<T>(collectionName)` - Get all documents
- `getDocument<T>(collectionName, docId)` - Get single document
- `addDocument(collectionName, data)` - Add new document
- `setDocument(collectionName, docId, data)` - Set document with ID
- `updateDocument(collectionName, docId, data)` - Update document
- `deleteDocument(collectionName, docId)` - Delete document


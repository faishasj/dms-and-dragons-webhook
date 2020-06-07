import admin from 'firebase-admin';
import { getGoogleServiceAccount } from '../services/Utils';

// Firestore Data Layer API (Not actually a model)

/** Firebase Initialization */
admin.initializeApp({
  credential: process.env.NODE_ENV === 'production'
    ? admin.credential.applicationDefault()
    : admin.credential.cert(getGoogleServiceAccount()),
});


export {
  CreateStoryViewSchema,
  CreateUserSchema,

  createStoryView,
  createUser,
  getStoryView,
  getUser,
} from './User';

export {
  CreateStorySchema,

  createStory,
  getStory,
} from './Story';
import admin from 'firebase-admin';
import { getGoogleServiceAccount } from '../Utils';

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
  updateStoryView,
  updateUser,
} from './User';

export {
  CreateStorySchema,

  createStory,
  getStory,
  getStories,
  getStorySteps,
  getStoryStep,
  getRootStoryStep,
} from './Story';

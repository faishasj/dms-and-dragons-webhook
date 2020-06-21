import { firestore } from 'firebase-admin';

// Model related Utilities

// Types

export enum Collection {
  Users = 'users',
  Stories = 'stories',
};
export enum SubCollection {
  StoryViews = 'library',
  Steps = 'steps',
};


// Helper Functions with typing

/** Get Collection Reference */
export const collection = (collectionName: Collection) => // Can change to support sub collections
  firestore().collection(collectionName);

/** Timestamp right now */
export const newTimestamp = (): firestore.Timestamp => // Can add options
  firestore.Timestamp.now();

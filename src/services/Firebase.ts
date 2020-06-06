import admin from 'firebase-admin';
import { getGoogleServiceAccount } from './Utils';


/** Firebase Initialization */

admin.initializeApp({
  credential: process.env.NODE_ENV === 'production'
    ? admin.credential.applicationDefault()
    : admin.credential.cert(getGoogleServiceAccount()),
});


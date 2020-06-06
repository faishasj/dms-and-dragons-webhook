import express from 'express';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';

import MessengerRouter from './routes/messenger';

/** Firebase Initialization */
const sa64 = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!sa64) throw new Error('Missing Firebase Service Account Environment');
const SERVICE_ACCOUNT = JSON.parse(Buffer.from(sa64, 'base64').toString('ascii'));

admin.initializeApp({
  credential: process.env.NODE_ENV === 'production'
    ? admin.credential.applicationDefault()
    : admin.credential.cert(SERVICE_ACCOUNT),
});


const app = express();
const PORT = process.env.PORT || 1337;

app.use(bodyParser.json());



app.use(MessengerRouter);



app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));

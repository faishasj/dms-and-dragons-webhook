import express from 'express';
import bodyParser from 'body-parser';

import { MessengerRouter, TestingRouter } from './routes';


const app = express();
const PORT = process.env.PORT || 1337;

app.use(bodyParser.json());



app.use('/webhook', MessengerRouter); // Messenger Bot Endpoints
app.use('/testing', TestingRouter); // Always included because testing these bots is a nightmare that requires production release for everything



app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));

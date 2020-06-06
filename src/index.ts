import express from 'express';
import bodyParser from 'body-parser';

import MessengerRouter from './routes/messenger';


const app = express();
const PORT = process.env.PORT || 1337;

app.use(bodyParser.json());



app.use(MessengerRouter);



app.listen(PORT, () => console.log(`Server stated on port ${PORT}`));

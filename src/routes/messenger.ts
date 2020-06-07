import Router from 'express';
import { FacebookMessageParser } from 'fb-messenger-bot-api';
import { asyncUtil } from '../middleware/asyncUtil';
import { getSecret } from '../services/Secrets';

const router = Router();


// Creates the endpoint for our webhook
router.post('/webhook', asyncUtil((req, res) => {
  const { body } = req;

  console.log(JSON.stringify(body));
  const parsed = FacebookMessageParser.parsePayload(body);
  console.log(JSON.stringify(parsed));

  res.status(200).send();
}));

// Adds support for GET requests to our webhook
router.get('/webhook', asyncUtil(async (req, res) => {

  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = await getSecret('VERIFY_TOKEN');

  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
}));


export default router;

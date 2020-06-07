import Router from 'express';
import { FacebookMessageParser, ValidateWebhook } from 'fb-messenger-bot-api';
import { asyncUtil } from '../middleware/asyncUtil';
import { getSecret } from '../services/Secrets';

const router = Router();


/** Incoming Message Endpoint */
router.post('/webhook', asyncUtil((req, res) => {
  const { body } = req;

  const parsed = FacebookMessageParser.parsePayload(body);
  const message = parsed[0];
  console.log(parsed.length, ' Messages'); // Want to confirm that this is always 1
  console.log('INCOMING: ', JSON.stringify(parsed.length > 1 ? parsed : message));

  res.status(200).send();
}));


/** Messenger verification */
router.get('/webhook', asyncUtil(async (req, res) => {
  const token = await getSecret('VERIFY_TOKEN');
  return ValidateWebhook.validateServer(req, res, token);
}));


export default router;

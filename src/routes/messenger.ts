import Router from 'express';
import { FacebookMessageParser, ValidateWebhook } from 'fb-messenger-bot-api';
import { asyncUtil } from '../middleware/asyncUtil';
import { getSecret } from '../services/Secrets';
import { getUser } from '../model';
import { Payloads } from '../Messenger';
import { newUser, introduction } from '../services/User';

const router = Router();


/** Incoming Message Endpoint */
router.post('/', asyncUtil(async (req, res) => {
  const { body } = req;

  const parsed = FacebookMessageParser.parsePayload(body);
  const message = parsed[0];
  console.log(parsed.length, ' Messages'); // Want to confirm that this is always 1
  console.log('INCOMING: ', JSON.stringify(parsed.length > 1 ? parsed : message));

  const { id: userId } = message.sender;
  const { payload } = message.postback || {};
  const { text } = message.message || {};
  let user = await getUser(userId);

  if (!user) { // New User
    user = await newUser(userId);
    if (payload !== Payloads.NEW_CONVERSATION) {
      // No user and not start of conversation, should never happen
      console.error(`User Missing\n${JSON.stringify(message)}`);
    }
  }

  // Existing User
  if (payload === Payloads.NEW_CONVERSATION) introduction(user);

  return res.status(200).send();
}));


/** Messenger verification */
router.get('/', asyncUtil(async (req, res) => {
  const token = await getSecret('VERIFY_TOKEN');
  return ValidateWebhook.validateServer(req, res, token);
}));


export default router;

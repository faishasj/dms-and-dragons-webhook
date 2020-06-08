import Router from 'express';
import { FacebookMessageParser, ValidateWebhook } from 'fb-messenger-bot-api';
import { asyncUtil } from '../middleware/asyncUtil';
import { getSecret } from '../services/Secrets';
import { getUser } from '../model';
import { Payloads, getMessenger } from '../Messenger';
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

  const messenger = await getMessenger();
  messenger.markSeen(userId);
  messenger.toggleTyping(userId, true);

  let user = await getUser(userId);

  if (!user) { // New User
    user = await newUser(userId);
    if (payload !== Payloads.NEW_CONVERSATION) console.error(`User was Missing\n${JSON.stringify(message)}`);
  }

  // Existing User
  if (payload === Payloads.NEW_CONVERSATION) introduction(user);
  if (payload?.slice(0, Payloads.READ_NEW_STORY.length) === Payloads.READ_NEW_STORY)
    console.log('START STORY');

  return res.status(200).send();
}));


/** Messenger verification */
router.get('/', asyncUtil(async (req, res) => {
  const token = await getSecret('VERIFY_TOKEN');
  return ValidateWebhook.validateServer(req, res, token);
}));


export default router;

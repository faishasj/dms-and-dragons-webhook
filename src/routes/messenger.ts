import Router from 'express';
import { FacebookMessageParser, ValidateWebhook, BUTTON_TYPE, IURLButton } from 'fb-messenger-bot-api';
import { asyncUtil } from '../middleware/asyncUtil';
import { getSecret } from '../services/Secrets';
import { newUser, introduction } from '../services/User';
import { Payloads, getMessenger } from '../Messenger';
import { getUser } from '../model';
import { CREATE_STORY_URL } from '../Constants';
import { directToLibrary } from '../services/Stories';

const router = Router();


/** Incoming Message Endpoint */
router.post('/', asyncUtil(async (req, res) => {
  const { body } = req;

  const parsed = FacebookMessageParser.parsePayload(body);
  const message = parsed[0];
  console.log(parsed.length, ' Messages'); // Want to confirm that this is always 1
  console.log('INCOMING: ', JSON.stringify(parsed.length > 1 ? parsed : message));

  const { id: userId } = message.sender;
  const { payload: postBackPayload } = message.postback || {};
  const { payload: quickReplyPayload } =  message.message?.quick_reply || {};
  const { text } = message.message || {};

  const messenger = await getMessenger();
  messenger.markSeen(userId);
  messenger.toggleTyping(userId, true);

  let user = await getUser(userId);

  if (!user) { // New User
    user = await newUser(userId);
    if (postBackPayload !== Payloads.NEW_CONVERSATION) console.error(`User was Missing\n${JSON.stringify(message)}`);
  }

  // Existing User
  
  if (postBackPayload === Payloads.NEW_CONVERSATION) introduction(user);
  if (postBackPayload === Payloads.BROWSE_STORIES) { console.log('VIEW STORIES'); messenger.toggleTyping(userId, false); }
  if (postBackPayload?.slice(0, Payloads.READ_NEW_STORY.length) === Payloads.READ_NEW_STORY) {
    const storyId = postBackPayload.slice(Payloads.READ_NEW_STORY.length);
    console.log('START STORY: ', storyId);
    messenger.toggleTyping(userId, false);
  }

  if (quickReplyPayload === Payloads.CREATE_STORY) directToLibrary(user);


  return res.status(200).send();
}));


/** Messenger verification */
router.get('/', asyncUtil(async (req, res) => {
  const token = await getSecret('VERIFY_TOKEN');
  return ValidateWebhook.validateServer(req, res, token);
}));


export default router;

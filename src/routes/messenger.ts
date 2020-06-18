import Router from 'express';
import { FacebookMessageParser, ValidateWebhook } from 'fb-messenger-bot-api';
import { asyncUtil } from '../middleware/asyncUtil';
import { getSecret } from '../Secrets';
import { newUser, introduction } from '../services/User';
import { Payloads, getMessenger } from '../Messenger';
import { getUser } from '../model';
import { directToLibrary, directToMyStories, readNewStory } from '../services/Stories';

const router = Router();


/** Incoming Message Endpoint */
router.post('/', asyncUtil(async (req, res) => {
  const { body } = req;

  const parsed = FacebookMessageParser.parsePayload(body);
  const message = parsed[0];

  const { id: userId } = message.sender;
  const { payload: postbackPayload } = message.postback || {};
  const { payload: quickReplyPayload } =  message.message?.quick_reply || {};
  const { text } = message.message || {};

  const messenger = await getMessenger();
  messenger.markSeen(userId);
  messenger.toggleTyping(userId, true);

  let user = await getUser(userId);

  if (!user) { // New User
    user = await newUser(userId);
    if (postbackPayload !== Payloads.NEW_CONVERSATION) console.error(`User was Missing\n${JSON.stringify(message)}`);
  }

  // Existing User

  if (postbackPayload === Payloads.NEW_CONVERSATION) introduction(user);

  if (postbackPayload?.slice(0, Payloads.READ_NEW_STORY.length) === Payloads.READ_NEW_STORY) {
    const storyId = postbackPayload.slice(Payloads.READ_NEW_STORY.length);
    await readNewStory(userId, storyId);
    messenger.toggleTyping(userId, false);
  }

  if (quickReplyPayload === Payloads.BROWSE_STORIES) directToLibrary(user);

  if (quickReplyPayload === Payloads.CREATE_STORY) directToMyStories(user);

  return res.status(200).send();
}));


/** Messenger verification */
router.get('/', asyncUtil(async (req, res) => {
  const token = await getSecret('VERIFY_TOKEN');
  return ValidateWebhook.validateServer(req, res, token);
}));


export default router;

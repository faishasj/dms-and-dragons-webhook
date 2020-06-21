import Router from 'express';
import { FacebookMessageParser, ValidateWebhook } from 'fb-messenger-bot-api';
import { asyncUtil } from '../middleware/asyncUtil';
import { getSecret } from '../Secrets';
import { newUser, introduction, sendOptions, setUserProcessingStatus } from '../services/User';
import { Payloads, getMessenger, init } from '../Messenger';
import { getUser } from '../model';
import { directToLibrary, directToMyStories, readNewStory, exitStory, readStory } from '../services/Stories';
import Strings from '../Strings';

const router = Router();


/** Incoming Message Endpoint */
router.post('/', asyncUtil(async (req, res) => {
  const { body } = req;

  const initPromise = getSecret('PAGE_ACCESS_TOKEN').then(tok => init(tok));
  // Parsing
  const parsed = FacebookMessageParser.parsePayload(body);
  const message = parsed[0];

  const { id } = message.sender;
  const { payload: postbackPayload } = message.postback || {};
  const { payload: quickReplyPayload } =  message.message?.quick_reply || {};
  const { text, mid: messageId } = message.message || {};

  // Basic Message Acknowledgment
  const messenger = await getMessenger();
  messenger.markSeen(id);
  messenger.toggleTyping(id, true);

  // User Data
  let user = await getUser(id);
  const isNewUser = !user;
  if (!user) { // New User
    user = await newUser(id);
    if (postbackPayload !== Payloads.NEW_CONVERSATION) console.error(`User was Missing\n${JSON.stringify(message)}`);
  }
  const { id: userId, activeStory, processing } = user;

  let setProcessingPromise: Promise<boolean> | null = null;
  if (!isNewUser) {
    if (processing) return res.status(200).send(); // Currently responding
    setProcessingPromise = setUserProcessingStatus(userId, true);
  }

  await initPromise;

  // Story Reading
  if (activeStory && !!text && !!messageId) {
    if (postbackPayload === Payloads.EXIT_STORY) exitStory(user); // Menu option possible from active story
    else await readStory(user, { text, messageId });
    if (setProcessingPromise) await setProcessingPromise;
    await setUserProcessingStatus(userId, false);
    return res.status(200).send();
  }


  // Menu Navigation

  if (postbackPayload?.slice(0, Payloads.READ_NEW_STORY.length) === Payloads.READ_NEW_STORY) {
    const storyId = postbackPayload.slice(Payloads.READ_NEW_STORY.length);
    await readNewStory(user, storyId);
  }
  else if (postbackPayload === Payloads.EXIT_STORY) exitStory(user);
  else if (postbackPayload === Payloads.NEW_CONVERSATION) introduction(user);
  else if (quickReplyPayload === Payloads.BROWSE_STORIES) directToLibrary(user);
  else if (quickReplyPayload === Payloads.CREATE_STORY) directToMyStories(user);
  else sendOptions(userId, Strings.unknownCommand);

  if (setProcessingPromise) await setProcessingPromise;
  await setUserProcessingStatus(userId, false);
  return res.status(200).send();
}));


/** Messenger verification */
router.get('/', asyncUtil(async (req, res) => {
  const token = await getSecret('VERIFY_TOKEN');
  return ValidateWebhook.validateServer(req, res, token);
}));


export default router;

import { FacebookMessagingAPIClient, FacebookProfileAPIClient } from 'fb-messenger-bot-api';
import { getSecret } from './Secrets';
import { User } from './Types';
import { wait } from './Utils';

let messagingClient: FacebookMessagingAPIClient;
let profileClient: FacebookProfileAPIClient;

// Custom Payloads
export enum Payloads {
  NEW_CONVERSATION = 'GET_STARTED_PAYLOAD',
  READ_NEW_STORY = 'READ:', // append story id
  CREATE_STORY = 'CREATE_STORY',
  BROWSE_STORIES = 'BROWSE_STORIES',
  EXIT_STORY = 'EXIT_STORY',
};


export const getMessenger = async (): Promise<FacebookMessagingAPIClient> => {
  if (!messagingClient) {
    const token = await getSecret('PAGE_ACCESS_TOKEN');
    messagingClient = new FacebookMessagingAPIClient(token);
  }
  return messagingClient;
}

export const getProfile = async (): Promise<FacebookProfileAPIClient> => {
  if (!profileClient) {
    const token = await getSecret('PAGE_ACCESS_TOKEN');
    profileClient = new FacebookProfileAPIClient(token);
  }
  return profileClient;
};

export const waitTyping = async (userId: User['id'], duration = 1000): Promise<void> => {
  const messenger = await getMessenger();
  await messenger.toggleTyping(userId, true);
  await wait(duration);
  messenger.toggleTyping(userId, false);
}

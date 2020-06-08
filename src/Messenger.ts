import { FacebookMessagingAPIClient } from 'fb-messenger-bot-api';
import { getSecret } from './services/Secrets';

let messagingClient: FacebookMessagingAPIClient;

// Custom Payloads
export enum Payloads {
  NEW_CONVERSATION = 'GET_STARTED_PAYLOAD',
  READ_NEW_STORY = 'READ:', // append story id
};


export const getMessenger = async (): Promise<FacebookMessagingAPIClient> => {
  if (!messagingClient) {
    const token = await getSecret('PAGE_ACCESS_TOKEN');
    console.log('INIT MESSENGER');
    messagingClient = new FacebookMessagingAPIClient(token);
  }
  return messagingClient;
}

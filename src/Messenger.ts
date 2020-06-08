import { FacebookMessagingAPIClient } from 'fb-messenger-bot-api';
import { getSecret } from './services/Secrets';

let messagingClient: FacebookMessagingAPIClient;

// Custom Payloads
export enum Payloads {
  NEW_CONVERSATION = 'GET_STARTED_PAYLOAD',
};


export const getMessenger = async (): Promise<FacebookMessagingAPIClient> => {
  if (!messagingClient) {
    const token = await getSecret('PAGE_ACCESS_TOKEN');
    messagingClient = new FacebookMessagingAPIClient(token);
  }
  return messagingClient;
}

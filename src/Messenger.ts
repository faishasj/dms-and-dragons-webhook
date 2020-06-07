import { FacebookMessagingAPIClient } from 'fb-messenger-bot-api';
import { getSecret } from './services/Secrets';

let messagingClient: FacebookMessagingAPIClient;

export const getMessenger = async (): Promise<FacebookMessagingAPIClient> => {
  if (!messagingClient) {
    const token = await getSecret('PAGE_ACCESS_TOKEN');
    messagingClient = new FacebookMessagingAPIClient(token);
  }
  return messagingClient;
}

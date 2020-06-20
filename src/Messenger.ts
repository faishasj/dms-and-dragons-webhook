import { FacebookMessagingAPIClient, FacebookProfileAPIClient } from 'fb-messenger-bot-api';
import axios from 'axios';
import { getSecret } from './Secrets';
import { User, Persona } from './Types';
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


// Messenger Platform not supported by library

interface FacebookPersona { name: string; profile_picture_url: string; id: string }

export const createPersona = async (name: string, profilePic: string): Promise<Persona> => {
  const token = await getSecret('PAGE_ACCESS_TOKEN');

  const { data: { id } } = await axios.post<{ id: string }>('https://graph.facebook.com/me/personas', {
    name,
    profile_picture_url: profilePic,
  }, { params: { access_token: token } });

  return { id, name, profilePic };
};
export const deletePersona = async (personaId: string): Promise<boolean> => {
  const token = await getSecret('PAGE_ACCESS_TOKEN');

  const { data: { success } } = await axios.delete<{ success: boolean }>(`https://graph.facebook.com/${personaId}`, {
    params: { access_token: token },
  });

  return success;
};
export const getPersonas = async (): Promise<Persona[]> => {
  const token = await getSecret('PAGE_ACCESS_TOKEN');

  const { data: { data } } = await axios.get<{data: FacebookPersona[]; }>('https://graph.facebook.com/me/personas', {
    params: { access_token: token },
  });

  return data.map(({ id, name, profile_picture_url }) => ({ id, name, profilePic: profile_picture_url }) as Persona);
};
export const getPersona = async (personaId: string): Promise<Persona> => {
  const token = await getSecret('PAGE_ACCESS_TOKEN');

  const { data: { id, name, profile_picture_url } } = await axios.get<FacebookPersona>(`https://graph.facebook.com/${personaId}`, {
    params: { access_token: token },
  });

  return { id, name, profilePic: profile_picture_url };
};

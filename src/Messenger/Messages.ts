import { getApi } from './Utils';
import { MessageBody, AttachmentType, MessengerResponse, MessengerSuccess, MessengerError } from './Types';


// Facebook Messenger API


const sendMessage = async (psid: string, messageBody: MessageBody, personaId?: string): Promise<MessengerResponse> => {
  try {
    const { data } = await getApi().post<MessengerSuccess>('/me/messages', {
      recipient: { id: psid },
      message: messageBody,
      persona_id: personaId,
    });
    return data;
  } catch (e) {
    if (e.response) { return e.response.data as MessengerError; }
    console.warn(e.request || e.message);
    return e.request || e.message;
  }
};

export const sendTextMessage = (psid: string, text: string, personaId?: string) =>
  sendMessage(psid, { text }, personaId);

export const sendImageMessage = (psid: string, imageUrl: string, personaId?: string) =>
  sendMessage(psid, {
    attachment: {
      type: AttachmentType.Image,
      payload: { url: imageUrl, is_reusable: false }
    },
  }, personaId);


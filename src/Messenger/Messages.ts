import { getApi } from './Utils';
import { MessageBody, AttachmentType, MessengerResponse, MessengerSuccess, MessengerError } from './Types';


// Facebook Messenger API


const sendMessage = async (psid: string, messageBody: MessageBody): Promise<MessengerResponse> => {
  try {
    const { data } = await getApi().post<MessengerSuccess>('/me/messages', {
      recipient: { id: psid },
      message: messageBody,
    });
    return data;
  } catch (e) {
    if (e.response) { return e.response.data as MessengerError; }
    console.warn(e.request || e.message);
    return e.request || e.message;
  }
};

export const sendTextMessage = (psid: string, text: string) => sendMessage(psid, { text });

export const sendImageMessage = (psid: string, imageUrl: string) =>
  sendMessage(psid, {
    attachment: {
      type: AttachmentType.Image,
      payload: { url: imageUrl, is_reusable: false }
    },
  });


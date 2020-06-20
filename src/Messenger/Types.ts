


export enum MessagingType {
  Response = 'RESPONSE',
  Update = 'UPDATE',
  Tag = 'MESSAGE_TAG',
};

export enum AttachmentType {
  Audio = 'audio',
  Video = 'video',
  Image = 'image',
  File = 'file',
  Template = 'template',
}

export enum TemplateType {
  Generic = 'generic',
  Button = 'button',
  Media = 'media',
  Receipt = 'receipt',
}

export interface TextBody { text: string; }

export interface AttachmentBody {
  attachment: {
    type: AttachmentType;
    payload: { url: string; is_reusable: boolean; }
  }
}

export type MessageBody = TextBody | AttachmentBody;


export interface MessengerSuccess {
  recipient_id: string;
  message_id: string;
}

export interface MessengerError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode: number;
    fbtrace_id: string;
  }
}

export type MessengerResponse = MessengerSuccess | MessengerError;

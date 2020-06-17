import { IURLButton, BUTTON_TYPE } from "fb-messenger-bot-api";
// App Wide Constants


export const URL_BUTTON: Partial<IURLButton> = {
  type: BUTTON_TYPE.URL,
  messenger_extensions: true,
  webview_height_ratio: "full",
  webview_share_button: "hide",
};


// URLs
export const CREATE_STORY_URL = process.env.NODE_ENV !== 'production' && process.env.DEV_WEBVIEW_URL 
  ? process.env.DEV_WEBVIEW_URL + 'my-stories'
  : 'https://dms-and-dragons.firebaseapp.com/my-stories';

export const BROWSE_STORIES_URL = process.env.NODE_ENV !== 'production' && process.env.DEV_WEBVIEW_URL 
  ? process.env.DEV_WEBVIEW_URL + 'library'
  : 'https://dms-and-dragons.firebaseapp.com/library';

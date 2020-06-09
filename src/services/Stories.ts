import { IURLButton, BUTTON_TYPE } from 'fb-messenger-bot-api';
import { getMessenger } from '../Messenger';
import { CREATE_STORY_URL } from '../Constants';
import { User } from '../Types';
import Strings from '../Strings';

// Stories Services

export const directToLibrary = async ({ id }: User) => {
  const messenger = await getMessenger();

  const libraryButton: IURLButton = {
    type: BUTTON_TYPE.URL,
    url: CREATE_STORY_URL,
    title: Strings.openLibrary,
    messenger_extensions: true,
    webview_height_ratio: "full",
    webview_share_button: "hide"
  };
  messenger.sendButtonsMessage(id, "Click here to view library", [libraryButton]);
  messenger.toggleTyping(id, false);
};

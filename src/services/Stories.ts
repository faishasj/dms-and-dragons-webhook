import { getMessenger } from '../Messenger';
import { CREATE_STORY_URL, URL_BUTTON } from '../Constants';
import { User } from '../Types';
import Strings from '../Strings';

// Stories Services

export const directToLibrary = async ({ id }: User) => {
  const messenger = await getMessenger();

  const libraryButton = { ...URL_BUTTON, url: CREATE_STORY_URL, title: Strings.openLibrary };
  messenger.sendButtonsMessage(id, "Click here to view library", [libraryButton as any]);
  messenger.toggleTyping(id, false);
};

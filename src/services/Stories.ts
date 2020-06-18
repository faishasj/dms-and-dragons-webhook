import { CREATE_STORY_URL, URL_BUTTON, BROWSE_STORIES_URL } from '../Constants';
import { updateUser } from '../model/User';
import { getMessenger } from '../Messenger';
import { User, Story } from '../Types';
import { waitTyping } from './User';
import Strings from '../Strings';

// Stories Services

export const directToMyStories = async ({ id }: User) => {
  const messenger = await getMessenger();

  const button = { ...URL_BUTTON, url: CREATE_STORY_URL, title: Strings.openMyStories };
  messenger.sendButtonsMessage(id, Strings.openMyStoriesPrompt, [button as any]);
  messenger.toggleTyping(id, false);
};

export const directToLibrary = async ({ id }: User) => {
  const messenger = await getMessenger();

  const button = { ...URL_BUTTON, url: BROWSE_STORIES_URL, title: Strings.openLibrary };
  messenger.sendButtonsMessage(id, Strings.openLibraryPrompt, [button as any]);
  messenger.toggleTyping(id, false);
};

export const readNewStory = async (userId: User['id'], storyId: Story['id']): Promise<void> => {
  const messenger = await getMessenger();

  updateUser({ id: userId, activeStory: storyId });

  await waitTyping(userId, 2000);
  await messenger.sendTextMessage(userId, `READ STORY: ${storyId}`);
};

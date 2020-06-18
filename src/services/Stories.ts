import { CREATE_STORY_URL, URL_BUTTON, BROWSE_STORIES_URL } from '../Constants';
import { updateUser } from '../model/User';
import { getMessenger } from '../Messenger';
import { User, Story } from '../Types';
import { waitTyping } from './User';
import Strings from '../Strings';

// Stories Services

export const directToMyStories = async ({ id }: User): Promise<void> => {
  const messenger = await getMessenger();

  const button = { ...URL_BUTTON, url: CREATE_STORY_URL, title: Strings.openMyStories };
  messenger.sendButtonsMessage(id, Strings.openMyStoriesPrompt, [button as any]);
  messenger.toggleTyping(id, false);
};

export const directToLibrary = async ({ id }: User): Promise<void> => {
  const messenger = await getMessenger();

  const button = { ...URL_BUTTON, url: BROWSE_STORIES_URL, title: Strings.openLibrary };
  messenger.sendButtonsMessage(id, Strings.openLibraryPrompt, [button as any]);
  messenger.toggleTyping(id, false);
};

export const readNewStory = async (id: User['id'], storyId: Story['id']): Promise<void> => {
  const messenger = await getMessenger();

  updateUser({ id, activeStory: storyId });

  await waitTyping(id, 2000);
  await messenger.sendTextMessage(id, `READ STORY: ${storyId}`);
};

export const exitStory = async ({ id, activeStory }: User): Promise<void> => {
  const messenger = await getMessenger();
  if (!activeStory) { // Not in a story
    await messenger.sendTextMessage(id, Strings.cannotExit);
    return;
  }

  updateUser({ id, activeStory: null });
  await messenger.sendTextMessage(id, Strings.exit);
};

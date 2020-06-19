import { CREATE_STORY_URL, URL_BUTTON, BROWSE_STORIES_URL } from '../Constants';
import { updateUser, getUser, createStoryView, getStoryView } from '../model/User';
import { getMessenger, waitTyping } from '../Messenger';
import { User, Story, StoryView } from '../Types';
import Strings from '../Strings';
import { getStory } from '../model';
import { getStoryStep } from '../model/Story';

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

export const readNewStory = async (maybeUser: User | User['id'], storyId: Story['id']): Promise<void> => {
  const messenger = await getMessenger();
  const user = typeof maybeUser === 'string' ? await getUser(maybeUser) : maybeUser;
  if (!user) return console.warn('User does not exist! ' + maybeUser);
  const { id } = user;

  const story = await getStory(storyId);
  if (!story) return console.warn('Story does not exist! ' + storyId);
  updateUser({ id, activeStory: storyId });
  const storyViewPromise = createStoryView(id, { storyId });

  await waitTyping(id, 2000);
  await messenger.sendTextMessage(id, Strings.newStory(story.metadata.title));
  await readStory(user, storyId, await storyViewPromise);
};

export const exitStory = async ({ id, activeStory }: User): Promise<void> => {
  const messenger = await getMessenger();
  if (!activeStory) { // Not in a story
    await messenger.sendTextMessage(id, Strings.cannotExit);
    return;
  }

  updateUser({ id, activeStory: null });
  await messenger.sendTextMessage(id, Strings.exit);
  messenger.toggleTyping(id, false);
};

export const readStory = async (user: User, storyId?: Story['id'], maybeStoryView?: StoryView): Promise<void> => {
  const { id, activeStory } = user;
  if (!storyId && !activeStory) return console.warn(`Reading with no active story! ${storyId} ${activeStory}`)
  const messenger = await getMessenger();

  const story = await getStory((storyId || activeStory) as string);
  if (!story) return console.warn(`Cannot find Story ${storyId} ${activeStory}`);
  const storyView = maybeStoryView || await getStoryView(id, story.id);
  if (!storyView) return console.warn(`Cannot find existing Story View ${id} ${story.id}`);
  const currentStep = await getStoryStep(story.id, storyView.stepCounter)
  if (!currentStep) return console.warn(`Cannot find current Step ${story.id} ${storyView.stepCounter}`);

  for ( const { typingTime, text } of currentStep.messages) { // iterative loop to maintain order
    await waitTyping(id, typingTime);
    await messenger.sendTextMessage(id, text);
  };


  messenger.toggleTyping(id, false);
};

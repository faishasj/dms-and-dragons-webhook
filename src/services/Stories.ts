import { CREATE_STORY_URL, URL_BUTTON, BROWSE_STORIES_URL } from '../Constants';
import { getMessenger, waitTyping } from '../Messenger';
import { User, Story, StoryView, Step } from '../Types';
import {
  getUser,
  updateUser,
  getStory,
  createStoryView,
  getStoryView,
  getStoryStep,
  getRootStoryStep,
  updateStoryView,
} from '../model';
import { wait } from '../Utils';
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
  await readStory(user, { text: '', messageId: '' }, storyId, await storyViewPromise);
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

export const readStory = async (
  user: User,
  { text, messageId }: { text: string; messageId: string },
    maybeStoryId?: Story['id'],
    maybeStoryView?: StoryView,
): Promise<void> => {
  const { id, activeStory } = user;
  if (!maybeStoryId && !activeStory) return console.warn(`Reading with no active story! ${maybeStoryId} ${activeStory}`)
  const messenger = await getMessenger();

  const story = await getStory((maybeStoryId || activeStory) as string);
  if (!story) return console.warn(`Cannot find Story ${maybeStoryId} ${activeStory}`);
  const { id: storyId } = story;
  const storyView = maybeStoryView || await getStoryView(id, storyId);
  if (!storyView) return console.warn(`Cannot find existing Story View ${id} ${storyId}`);
  const { lastStep, messages } = storyView;

  let currentStep: Step | null = null;
  if (!lastStep) currentStep = await getRootStoryStep(storyId); // Start of story, root step
  else {
    const previousStep = await getStoryStep(storyId, lastStep);
    if (!previousStep) console.warn('Could not find previous step');
    else {
      const { options } = previousStep;
      const matchedOption = options
        .find(({ requiredText }) => !requiredText || requiredText.toLowerCase() === text.toLowerCase());
      if (!matchedOption) messenger.sendTextMessage(id, story.metadata.failureMessage);
      else {
        currentStep = await getStoryStep(storyId, matchedOption.stepId);
        if (!currentStep) console.warn(`Could not get Step from option ${matchedOption}`);
      }
    }
  }


  if (currentStep) {
    for (const { waitingTime, typingTime, text } of currentStep.messages) { // iterative loop to maintain order
      await wait(waitingTime);
      await waitTyping(id, typingTime);
      await messenger.sendTextMessage(id, text);
    };

    updateStoryView(id, {
      ...storyView,
      lastStep: currentStep.id,
      messages: [...messages, { text, fbMessageId: messageId, stepId: currentStep.id }],
    });
  }


  messenger.toggleTyping(id, false);
};

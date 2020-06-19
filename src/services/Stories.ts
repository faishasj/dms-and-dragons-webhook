import { CREATE_STORY_URL, URL_BUTTON, BROWSE_STORIES_URL } from '../Constants';
import { updateUser, getUser, createStoryView, getStoryView, updateStoryView } from '../model/User';
import { getMessenger, waitTyping } from '../Messenger';
import { User, Story, StoryView } from '../Types';
import Strings from '../Strings';
import { getStory } from '../model';
import { getStoryStep, getStorySteps, getStoryStepById } from '../model/Story';

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
  const { stepCounter, messages } = storyView;

  const steps = await getStorySteps(story.id, stepCounter);
  if (!steps.length) return console.warn(`Cannot find any steps ${storyId} ${stepCounter}`);
  let currentStep = null;
  if (steps.length > 1 && stepCounter > 0) {
    const previousMessage = messages.find((message) => message.stepCounter === stepCounter - 1);
    if (previousMessage) {
      const previousStep = await getStoryStepById(storyId, previousMessage.stepId);
      if (previousStep) {

        const matchedOption = previousStep.options
          .find(({ requiredText }) => requiredText.toLowerCase() === text.toLowerCase());
        if (matchedOption) currentStep = await getStoryStepById(storyId, matchedOption.stepId);
        else messenger.sendTextMessage(id, story.metadata.failureMessage);

      } else console.warn('Multiple Steps but previous step not found');
    } else console.warn('Multiple Steps but no previous message found');
  } else currentStep = steps[0];


  if (currentStep) {

    for ( const { typingTime, text } of currentStep.messages) { // iterative loop to maintain order
      await waitTyping(id, typingTime);
      await messenger.sendTextMessage(id, text);
    };

    updateStoryView(id, {
      ...storyView,
      stepCounter: stepCounter + 1,
      messages: [...messages, { text, stepCounter, fbMessageId: messageId, stepId: currentStep.id }],
    });
  }


  messenger.toggleTyping(id, false);
};

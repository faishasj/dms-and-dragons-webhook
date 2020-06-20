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
import { QUICK_REPLY_TYPE, ATTACHMENT_TYPE } from 'fb-messenger-bot-api';
import { sendOptions, sendPreview } from './User';
import { newTimestamp } from '../model/Utils';

// Stories Services

export const directToMyStories = async ({ id }: User): Promise<void> => {
  const messenger = await getMessenger();

  const button = { ...URL_BUTTON, url: CREATE_STORY_URL, title: Strings.openMyStories };
  messenger.sendButtonsMessage(id, Strings.openMyStoriesPrompt, [button as any]);
  messenger.toggleTyping(id, false);
};

export const directToLibrary = async ({ id }: User): Promise<void> => {
  const messenger = await getMessenger();

  await sendPreview(id);
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

export const exitStory = async ({ id, activeStory }: User, end = false): Promise<void> => {
  const messenger = await getMessenger();
  if (!activeStory) { // Not in a story
    await messenger.sendTextMessage(id, Strings.cannotExit);
    return;
  }

  updateUser({ id, activeStory: null });
  if (!end) {
    await messenger.sendTextMessage(id, Strings.exit);
    messenger.toggleTyping(id, false);
  }
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

  /** Basic Story Data */

  const story = await getStory((maybeStoryId || activeStory) as string);
  if (!story) return console.warn(`Cannot find Story ${maybeStoryId} ${activeStory}`);
  const { id: storyId } = story;
  const storyView = maybeStoryView || await getStoryView(id, storyId);
  if (!storyView) return console.warn(`Cannot find existing Story View ${id} ${storyId}`);
  const { lastStep, messages } = storyView;

  /** Determining Step/Position in Story */

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

  /** Story Messages to user */

  if (currentStep) {
    const end = !currentStep.options || currentStep.options.length <= 0;
    const nextOptions = end ? [] : currentStep.options.filter(({ requiredText }) => requiredText);

    // iterative loop to maintain order of messages
    for (const [i, { waitingTime, typingTime, text, image }] of currentStep.messages.entries()) {
      if (!text && !image) continue; // Bad message data
      await wait(waitingTime);
      await waitTyping(id, typingTime);
      if (i >= currentStep.messages.length -1 && nextOptions.length > 0)
        await messenger.sendQuickReplyMessage(
          id,
          text || { type: ATTACHMENT_TYPE.IMAGE, payload: { url: image } },
          nextOptions.map(({ requiredText }) => ({
            content_type: QUICK_REPLY_TYPE.TEXT,
            title: requiredText,
            payload: '',
          }),
        ));
      else {
        if (text) await messenger.sendTextMessage(id, text);
        else await messenger.sendImageMessage(id, image as string);
      }
    };

    if (end) { // End of Story
      exitStory(user, true);
      await wait(4000);
      await sendOptions(id, Strings.endStory(story.metadata.title));
    }

    updateStoryView(id, { // Record new Story Status
      ...storyView,
      lastStep: end ? null : currentStep.id, // Reset to start if it was the end
      endTime: end ? newTimestamp() : null,
      messages: [...messages, { text, fbMessageId: messageId, stepId: currentStep.id }],
    });
  }


  messenger.toggleTyping(id, false);
};

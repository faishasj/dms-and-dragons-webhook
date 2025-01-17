import { MESSAGE_TEMPLATE_TYPE, QUICK_REPLY_TYPE } from 'fb-messenger-bot-api';
import { User, Story } from '../Types';
import { getMessenger, Payloads, waitTyping, sendTextMessage } from '../Messenger';
import { createUser, getStories } from '../model';
import { wait } from '../Utils';
import Strings from '../Strings';
import { updateUser } from '../model/User';

// User Service

export const newUser = async (userId: User['id']): Promise<User> => {
  const messenger = await getMessenger();
  const { first_name } = await messenger.getUserProfile(userId, ['first_name']) as { first_name: string };
  return createUser({ id: userId, name: first_name });
};

export const introduction = async ({ id, name }: User) => {
  const storiesPromise = getStories(10);

  await waitTyping(id, 2000);
  await sendTextMessage(id, Strings.greeting(name));
  await wait(2000);
  await waitTyping(id, 3000);
  await sendTextMessage(id, Strings.intro1);
  await wait(2000);
  await waitTyping(id, 3000);
  await sendTextMessage(id, Strings.intro2);
  await wait(3000);
  await waitTyping(id, 3000);
  await sendTextMessage(id, Strings.intro3);
  await wait(1000);

  sendPreview(id, await storiesPromise);

  await sendOptions(id);
};

export const sendPreview = async (id: User['id'], maybeStories?: Story[], storyCount = 10) => {
  const messenger = await getMessenger();
  const stories = maybeStories || await getStories(storyCount);

  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic#carousel
  await messenger.sendTemplateMessage(id, {
    template_type: MESSAGE_TEMPLATE_TYPE.GENERIC,
    elements: stories.map(story => ({
      title: story.metadata.title,
      image_url: story.metadata.coverPhoto,
      subtitle: story.metadata.description,
      buttons: [{ type: 'postback', title: 'Read Now', payload: `${Payloads.READ_NEW_STORY}${story.id}` }],
    })),
  } as any);
};

export const sendOptions = async (id: User['id'], text = Strings.actionPrompt) => {
  const messenger = await getMessenger();

  await waitTyping(id, 3000);

  await messenger.sendQuickReplyMessage(id, text, [
    {
      content_type: QUICK_REPLY_TYPE.TEXT,
      title: Strings.openMyStories,
      payload: Payloads.CREATE_STORY,
    },
    {
      content_type: QUICK_REPLY_TYPE.TEXT,
      title: Strings.browseStories,
      payload: Payloads.BROWSE_STORIES,
    }
  ]);
}


export const setUserProcessingStatus = (userId: User['id'], status: boolean) =>
  updateUser({ id: userId, processing: status });

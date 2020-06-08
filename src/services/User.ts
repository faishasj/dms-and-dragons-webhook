import { MESSAGE_TEMPLATE_TYPE } from 'fb-messenger-bot-api';
import { User } from '../Types';
import { getMessenger, Payloads } from '../Messenger';
import { createUser, getStories } from '../model';
import { wait } from '../Utils';
import Strings from '../Strings';

// User Service


export const waitTyping = async (userId: User['id'], duration = 1000): Promise<void> => {
  const messenger = await getMessenger();
  await messenger.toggleTyping(userId, true);
  await wait(duration);
  messenger.toggleTyping(userId, false);
}

export const newUser = async (userId: User['id']): Promise<User> => {
  const messenger = await getMessenger();
  const { first_name } = await messenger.getUserProfile(userId, ['first_name']) as { first_name: string };
  return createUser({ id: userId, name: first_name });
};

export const introduction = async ({ id, name }: User) => {
  const messenger = await getMessenger();
  const storiesPromise = getStories(10);

  await waitTyping(id, 3000);
  await messenger.sendTextMessage(id, Strings.greeting(name));
  await waitTyping(id, 3000);
  await messenger.sendTextMessage(id, Strings.intro1);
  await waitTyping(id, 3000);
  await messenger.sendTextMessage(id, Strings.intro2);
  await waitTyping(id, 3000);
  await messenger.sendTextMessage(id, Strings.intro3);
  await waitTyping(id, 3000);

  const stories = await storiesPromise;
  // https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic#carousel
  messenger.sendTemplateMessage(id, {
    template_type: MESSAGE_TEMPLATE_TYPE.GENERIC,
    elements: stories.map(story => ({
      title: story.metadata.title,
      image_url: story.metadata.coverPhoto,
      subtitle: story.metadata.description,
      buttons: [{ type: 'postback', title: 'Read Now', payload: `${Payloads.READ_NEW_STORY}${story.id}` }],
    })),
  } as any);
};

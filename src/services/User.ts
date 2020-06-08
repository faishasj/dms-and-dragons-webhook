import { User } from '../Types';
import { getMessenger } from '../Messenger';
import { createUser } from '../model';
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

  await messenger.sendTextMessage(id, Strings.greeting(name));
  await waitTyping(id, 3000);
  await messenger.sendTextMessage(id, Strings.intro);
};

import { User } from '../Types';
import { getMessenger } from '../Messenger';
import { createUser } from '../model';
import { wait } from '../Utils';
import Strings from '../Strings';

// User Service


export const newUser = async (userId: User['id']): Promise<User> => {
  const messenger = await getMessenger();

  messenger.markSeen(userId);
  messenger.toggleTyping(userId, true);
  const { first_name } = await messenger.getUserProfile(userId, ['first_name']) as { first_name: string };
  return createUser({ id: userId, name: first_name });
};

export const introduction = async ({ id, name }: User) => {
  const messenger = await getMessenger();

  messenger.toggleTyping(id, false);
  await messenger.sendTextMessage(id, Strings.greeting(name));
  messenger.toggleTyping(id, true);
  await wait(3000);
  messenger.toggleTyping(id, false);
  await messenger.sendTextMessage(id, Strings.intro);
};

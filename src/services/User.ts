import { User } from '../Types';
import { getMessenger } from '../Messenger';
import { createUser } from '../model';
import { wait } from '../Utils';
import Strings from '../Strings';

// User Service


export const newUser = async (userId: User['id']) => {
  const messenger = await getMessenger();

  messenger.markSeen(userId);
  messenger.toggleTyping(userId, true);

  const [{ first_name }] = await Promise.all([
    messenger.getUserProfile(userId, ['first_name']) as Promise<{ first_name: string }>,
    wait(2000),
  ]);
  createUser({ id: userId, name: first_name });

  messenger.toggleTyping(userId, false);
  await messenger.sendTextMessage(userId, Strings.greeting(first_name));
  messenger.toggleTyping(userId, true);
  await wait(3000);
  messenger.toggleTyping(userId, false);
  await messenger.sendTextMessage(userId, Strings.intro);
};
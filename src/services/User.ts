import { User } from '../Types';
import { getMessenger } from '../Messenger';
import { createUser } from '../model';
import { wait } from '../Utils';
import Strings from '../Strings';

// User Service


export const newUser = async (userId: User['id']) => {
  const messenger = await getMessenger();
  const { first_name } = await messenger.getUserProfile(userId, ['first_name']) as { first_name: string };
  const user = await createUser({ id: userId, name: first_name });

  messenger.markSeen(userId);
  await messenger.toggleTyping(userId, true);
  wait();
  await messenger.toggleTyping(userId, false);
  await messenger.sendTextMessage(userId, Strings.greeting(user.name));
  await messenger.toggleTyping(userId, true);
  wait();
  await messenger.sendTextMessage(userId, Strings.intro);
};
import { User } from '../Types';
import { getMessenger } from '../Messenger';

// User Service


export const newUser = async (userId: User['id']) => {
  const [messenger] = await Promise.all([getMessenger()]);

  const profile = await messenger.getUserProfile(userId, ['first_name']);
  console.log('PROFILE: ', profile);
};
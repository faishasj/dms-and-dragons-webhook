import { User, StoryView, Story } from '../Types';
import { collection, Collection, SubCollection, newTimestamp } from './Utils';

// User Data


// Schemas

export interface CreateUserSchema { id: string; name: string; }
export interface CreateStoryViewSchema { storyId: Story['id']; }


// Functions

/** Get User */
export const getUser = async (userId: User['id']): Promise<User | null> => {
  const doc = await collection(Collection.Users).doc(userId).get();
  if (!doc.exists) return null;

  const user = {
    ...doc.data(),
    id: doc.id,
  } as User;

  return user;
};
/** Create User */
export const createUser = async ({ id, ...data }: CreateUserSchema): Promise<User> => {
  const newData: Partial<User> = { ...data, processing: true };
  await collection(Collection.Users).doc(id).set(data);

  const user = {
    ...data,
    id,
  } as User;

  return user;
};
/** Update User */
export const updateUser = async ({ id, ...userData }: Partial<User>): Promise<boolean> => {
  if (!id) throw new Error('No ID Specified for Update User Operation');
  await collection(Collection.Users).doc(id).update(userData);

  return true;
};

/** Get a User's Story View */
export const getStoryView = async (userId: User['id'], storyViewId: StoryView['id']): Promise<StoryView | null> => {
  const doc = await collection(Collection.Users).doc(userId)
    .collection(SubCollection.StoryViews).doc(storyViewId).get();
  if (!doc.exists) return null;

  const storyView = {
    ...doc.data(),
    id: doc.id,
  } as StoryView;

  return storyView;
}
/** Create a User's Story View */
export const createStoryView = async (userId: User['id'], { storyId, ...data }: CreateStoryViewSchema): Promise<StoryView> => {
  const newData: Partial<StoryView> = {
    ...data,
    messages: [],
    lastStep: null,
    startTime: newTimestamp(),
    lastOpened: newTimestamp(),
    endTime: null,
  };
  const ref = collection(Collection.Users).doc(userId)
    .collection(SubCollection.StoryViews).doc(storyId);

  const existing = await ref.get();
  if (existing.exists) await ref.update({ lastOpened: newData.lastOpened });
  else await ref.set(newData);

  const storyView = (existing.exists ? {
    ...existing.data(),
    lastOpened: newData.lastOpened,
    id: storyId,
  } : {
    ...newData,
    id: storyId,
  }) as StoryView;

  return storyView;
}
/** Update a Story View */
export const updateStoryView = async (userId: User['id'], { id, ...data }: Partial<StoryView>): Promise<boolean> => {
  if (!id) throw new Error('No ID Specified for Update Story View Operation');
  data.lastMessage = newTimestamp();
  await collection(Collection.Users).doc(userId).collection(SubCollection.StoryViews).doc(id).update(data);

  return true;
};

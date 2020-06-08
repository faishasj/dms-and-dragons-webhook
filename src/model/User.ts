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
  await collection(Collection.Users).doc(id).set(data);

  const user = {
    ...data,
    id,
  } as User;

  return user;
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
export const createStoryView = async (userId: User['id'], data: CreateStoryViewSchema): Promise<StoryView> => {
  const newData: Partial<StoryView> = {
    ...data,
    messages: [],
    stepCounter: 0,
    startTime: newTimestamp(),
    endTime: null,
  };
  const doc = await collection(Collection.Users).doc(userId)
    .collection(SubCollection.StoryViews).add(newData);

  const storyView = {
    ...newData,
    id: doc.id,
  } as StoryView;

  return storyView;
}

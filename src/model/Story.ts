import { Story, User, Uri } from '../Types';
import { collection, Collection } from './Utils';

// Story Data

// Schemas

export interface CreateStorySchema {
  authorId: User['id'];
  published: boolean;
  metadata: {
    coverPhoto: Uri;
    description: string;
    failureMessage: string;
    genre: string;
    title: string;
  };
}


// Functions

/** Get Story */
export const getStory = async (storyId: Story['id']): Promise<Story | null> => {
  const doc = await collection(Collection.Stories).doc(storyId).get();
  if (!doc.exists) return null;

  const story = {
    ...doc.data(),
    id: doc.id,
  } as Story;

  return story;
};
/** Create Story */
export const createStory = async (data: CreateStorySchema): Promise<Story> => {
  const ref = await collection(Collection.Stories).add(data);

  const story = {
    ...data,
    id: ref.id,
  } as Story;

  return story;
};
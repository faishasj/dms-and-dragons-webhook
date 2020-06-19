import { Story, User, Uri, Step } from '../Types';
import { collection, Collection, SubCollection } from './Utils';

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
/** Get Stories */
export const getStories = async (count?: number): Promise<Story[]> => {
  let query = collection(Collection.Stories).where('published', '==', true);
  if (count !== undefined) query = query.limit(count);
  const { docs } = await query.get();

  const stories = docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }) as Story);
  
  return stories;
};
/** Get Story Steps */
export const getStorySteps = async (storyId: Story['id']): Promise<Step[]> => {
  const { docs } = await collection(Collection.Stories).doc(storyId)
    .collection(SubCollection.Steps).get();
  
  const steps = docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }) as Step);
  return steps;
};
/** Get Story Step */
export const getStoryStep = async (storyId: Story['id'], stepCount: Step['stepCount']): Promise<Step | null> => {
  const { docs: [doc] } = await collection(Collection.Stories).doc(storyId).collection(SubCollection.Steps)
    .where('stepCount', '==', stepCount)
    .limit(1)
    .get();
  
  if (!doc) return null;

  const step = {
    ...doc.data(),
    id: doc.id,
  } as Step;
  return step;
}
/** Create Story */
export const createStory = async (data: CreateStorySchema): Promise<Story> => {
  const ref = await collection(Collection.Stories).add(data);

  const story = {
    ...data,
    id: ref.id,
  } as Story;

  return story;
};

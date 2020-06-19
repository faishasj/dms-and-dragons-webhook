import { firestore } from 'firebase-admin';

// App Wide Data Types


// Common Types

export type Uri = string;
export type DateTime = firestore.Timestamp;

// Entities

export interface User {
  id: string;
  name: string;
  activeStory: StoryView['id'] | null;
  processing: boolean;
}

export interface Story {
  id: string;
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

export interface StoryView {
  id: Story['id'];
  stepCounter: number;
  messages: {
    fbMessageId: string;
    stepCounter: number;
    stepId: Step['id'];
    text: string;
  }[];
  startTime: DateTime;
  endTime: DateTime | null;
  lastOpened: DateTime;
  lastMessage: DateTime | null;
}

export interface Step {
  id: string;
  stepCount: number;
  options: {
    stepId: Step['id'];
    requiredText: string;
  }[];
  messages: {
    text: string;
    typingTime: number;
  }[];
}

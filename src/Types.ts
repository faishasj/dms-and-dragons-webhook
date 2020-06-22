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
  personas: Persona[];
  metadata: {
    coverPhoto: Uri;
    description: string;
    failureMessage: string;
    genre: string;
    title: string;
  };
  dateCreated: DateTime;
  dateUpdated: DateTime;
}

export interface StoryView {
  id: Story['id'];
  lastStep: Step['id'] | null;
  messages: {
    fbMessageId: string;
    stepId: Step['id'];
    text: string;
    archived: boolean;
  }[];
  startTime: DateTime;
  endTime: DateTime | null;
  lastOpened: DateTime;
  lastMessage: DateTime | null;
}

export interface Step {
  id: string;
  root: boolean;
  options: {
    stepId: Step['id'];
    requiredText: string;
  }[];
  messages: {
    text?: string;
    image?: string;
    personaId?: Persona['id'];
    waitingTime: number;
    typingTime: number;
  }[];
}

export interface Persona {
  id: string;
  name: string;
  profilePic: string;
}

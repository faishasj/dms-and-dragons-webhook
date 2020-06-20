export default {
  profileGreetingMessage: 'Greetings, {{user_first_name}}, to DMs and Dragons 🐉. Are you ready to enter the fictional world inside your screen?',

  greeting: (name: string) => `Greetings, ${name}, to DMs and Dragons 🐉! Thanks for sliding into our DMs 😉`,
  intro1: 'Get your creative juices flowing and create your own interactive story told through Messenger to share with your friends, or the world!',
  intro2: 'Will it be a nail-biting creepypasta horror story 👻, or a modern romance a la Romeo and Juliet... if they had Facebook accounts 😍?',
  intro3: 'Or maybe, just grab a cup ☕ and wind down with a story from our user-submitted library:',

  actionPrompt: 'So, what are you feeling today?',

  browseStories: '📚 Browse Stories',
  openLibrary: '📚 Open Library',
  openLibraryPrompt: 'Click below to explore the full DMs and Dragons Library. 🤓',

  openMyStories: '✍️ Create Story',
  openMyStoriesPrompt: 'Click below to open the DM Creator and get writing! 🤔',

  exitStory: '🚫 Exit Story',
  cannotExit: 'Not currently in a story. Browse Stories to find something great!',
  exit: 'Hope you enjoyed! Keep reading this story from this point whenever you want',

  newStory: (title: string) => {
    const storyIntros = [
      `Without further ado... ${title}`,
      `Presenting... ${title}`,
    ];
    return storyIntros[Math.floor(Math.random() * storyIntros.length)];
  },
  endStory: (title: string) => {
    const storyConclusions = [
      `That concludes ${title}. Thanks for reading`,
      `That is the end of ${title}. Thanks for reading`,
    ];
    return storyConclusions[Math.floor(Math.random() * storyConclusions.length)];
  },
};
import readline from 'readline';
import { getProfile, Payloads } from '../Messenger';
import Strings from '../Strings';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



const run = async () => {
  const profile = await getProfile();

  await profile.setGetStartedAction(Payloads.NEW_CONVERSATION);
  await profile.setPersistentMenu([
    { type: 'postback', title: Strings.createStory, payload: Payloads.CREATE_STORY },
    { type: 'postback', title: Strings.browseStories, payload: Payloads.BROWSE_STORIES },
  ] as any); // These types are really bad
};



/** Main */

(async () => {
  rl.question('Override existing profile api configuration? ', async (answer) => {
    if (!answer || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('Setting new configuration...');
      try {
        await run();
        console.log('Configuration Set');
      } catch (e) { console.warn(e); }
    }
    process.exit();
  })
})();
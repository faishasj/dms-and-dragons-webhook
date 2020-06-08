import readline from 'readline';
import { getProfile, Payloads } from '../Messenger';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



const run = async () => {
  const profile = await getProfile();

  await profile.setGetStartedAction(Payloads.NEW_CONVERSATION);
  await profile.setPersistentMenu([
    { type: 'postback', title: 'Create Story', payload: Payloads.CREATE_STORY },
    { type: 'postback', title: 'View Stories', payload: Payloads.VIEW_STORIES },
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
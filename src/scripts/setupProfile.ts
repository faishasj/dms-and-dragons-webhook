import readline from 'readline';
import { getProfile, Payloads } from '../Messenger';
import Strings from '../Strings';
import { CREATE_STORY_URL, BROWSE_STORIES_URL } from '../Constants';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



const run = async () => {
  const profile = await getProfile();

  console.log(await profile.setGreetingMessage(Strings.profileGreetingMessage));
  console.log(await profile.setGetStartedAction(Payloads.NEW_CONVERSATION));
  const persistMenuOptions = {
    messenger_extensions: true,
    webview_height_ratio: "full",
    webview_share_button: "hide",
    type: 'web_url',
  }
  console.log(await profile.setPersistentMenu([
    { ...persistMenuOptions, title: Strings.createStory, url: CREATE_STORY_URL },
    { ...persistMenuOptions, title: Strings.browseStories, url: BROWSE_STORIES_URL },
  ] as any)); // These types are really bad
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
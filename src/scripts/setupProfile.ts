import axios from 'axios';
import readline from 'readline';
import { getSecret } from '../Secrets';
import { getProfile, Payloads } from '../Messenger';
import Strings from '../Strings';
import { CREATE_STORY_URL, BROWSE_STORIES_URL, URL_BUTTON, POSTBACK_BUTTON } from '../Constants';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


const run = async () => {
  const profile = await getProfile();
  const accessToken = await getSecret('PAGE_ACCESS_TOKEN');

  const response = await axios.post('https://graph.facebook.com/v7.0/me/messenger_profile', 
    {
      "whitelisted_domains":[
        "https://dms-and-dragons.firebaseapp.com/",
        "https://dms-and-dragons.firebaseio.com/",
        "https://dms-and-dragons.appspot.com/",
        process.env.DEV_WEBVIEW_URL
      ].filter(a => a)
    },
    { params: { access_token: accessToken } }
  );
  console.log(response.data);

  console.log(await profile.setGreetingMessage(Strings.profileGreetingMessage));
  console.log(await profile.setGetStartedAction(Payloads.NEW_CONVERSATION));
  console.log(await profile.setPersistentMenu([
    { ...URL_BUTTON, title: Strings.openMyStories, url: CREATE_STORY_URL },
    { ...URL_BUTTON, title: Strings.browseStories, url: BROWSE_STORIES_URL },
    { ...POSTBACK_BUTTON, title: Strings.exitStory, payload: Payloads.EXIT_STORY },
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
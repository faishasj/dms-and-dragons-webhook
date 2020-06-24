import Router from 'express';
import { asyncUtil } from '../middleware/asyncUtil';
import { readNewStory } from '../services/Stories';
import { getSecret } from '../Secrets';
import { init, createPersona } from '../Messenger';

const router = Router();


interface ReadStoryBody { userId: string; storyId: string; }
router.post('/readStory', asyncUtil<{}, {}, ReadStoryBody>(async (req, res) => {
  const { storyId, userId } = req.body;
  if (!storyId || !userId || typeof storyId !== 'string' || typeof userId !== 'string')
    return res.status(400).send();

  getSecret('PAGE_ACCESS_TOKEN').then(token => init(token)).then(() => readNewStory(userId, storyId));
  return res.status(200).send();
}));


interface CreatePersonaBody { name: string; profilePic: string; }
router.post('/createPersona', asyncUtil<{}, {}, CreatePersonaBody>(async (req, res) => {
  const { name, profilePic } = req.body;
  if (!name || !profilePic || typeof name !== 'string' || typeof profilePic !== 'string')
    res.status(400).send();
  
  const persona = await createPersona(name, profilePic);
  res.status(200).send(persona);
}));


export default router;
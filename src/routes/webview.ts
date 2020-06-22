import Router from 'express';
import { asyncUtil } from '../middleware/asyncUtil';
import { readNewStory } from '../services/Stories';
import { getSecret } from '../Secrets';
import { init } from '../Messenger';

const router = Router();


interface ReadStoryBody { userId: string; storyId: string; }
router.post('/readStory', asyncUtil<{}, {}, ReadStoryBody>(async (req, res) => {
  const { storyId, userId } = req.body;
  if (!storyId || !userId || typeof storyId !== 'string' || typeof userId !== 'string')
    return res.status(400).send();

  getSecret('PAGE_ACCESS_TOKEN').then(token => init(token)).then(() => readNewStory(userId, storyId));
  return res.status(200).send();
}));

export default router;
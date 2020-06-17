import Router from 'express';
import { asyncUtil } from '../middleware/asyncUtil';
import { updateUser } from '../model/User';

const router = Router();


interface ReadStoryBody { userId: string; storyId: string; }
router.post('/readStory', asyncUtil<{}, {}, ReadStoryBody>(async (req, res) => {
  const { storyId, userId } = req.body;
  if (!storyId || !userId || typeof storyId !== 'string' || typeof userId !== 'string')
    return res.status(400).send();
  
  await updateUser({ activeStory: storyId });
  

  return res.status(200).send();
}));

export default router;
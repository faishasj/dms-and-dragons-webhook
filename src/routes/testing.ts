import { Router, Request, Response } from 'express';
import { asyncUtil } from '../middleware/asyncUtil';
import { getUser, getStories } from '../model';


const router = Router();

router.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') res.status(418).send();
  next();
});


router.get('/getUser', asyncUtil(async (req: Request<{}, {}, {}, { userId: string }>, res: Response) => {
  const { userId } = req.query;
  if (!userId) res.status(400).send();

  const user = await getUser(userId);

  res.status(200).send({ user });
}));

router.get('/getStories', asyncUtil(async (req, res) => {
  const stories = await getStories();
  res.status(200).send({ stories });
}));


export default router;

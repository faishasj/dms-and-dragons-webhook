import { Router, Request, Response } from 'express';
import { asyncUtil } from '../middleware/asyncUtil';
import { getUser } from '../model';


const router = Router();

router.use((req, res) => {
  if (process.env.NODE_ENV !== 'development') res.status(418).send();
});


router.get('/getUser', asyncUtil(async (req: Request<{ userId: string }>, res: Response) => {
  const { userId } = req.params;
  const user = await getUser(userId);
  res.status(200).send({ user });
}));


export default router;

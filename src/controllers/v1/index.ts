import { Router } from 'express';
import { getHistoryHandler } from './history';
import { toolRouters } from './tools';
const router = Router();

router.use('/tools', toolRouters);
router.get('/history', getHistoryHandler)
export default router;

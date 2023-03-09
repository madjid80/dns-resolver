import { Router } from 'express';
import { toolRouters } from './tools';
const router = Router();

router.use('/tools', toolRouters);

export default router;

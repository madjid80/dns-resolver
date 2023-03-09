import { Router } from 'express';
import { healthCheckControllerHandler } from './healthCheck';
import { toolRouters } from './tools';
const router = Router();

router.get('/health', healthCheckControllerHandler);
router.use('/tools', toolRouters);

export default { router };

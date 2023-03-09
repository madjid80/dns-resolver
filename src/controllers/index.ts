import { Router } from 'express';
import { healthCheckControllerHandler } from './healthCheck';
import v1Routes from './v1'
const router = Router();

router.get('/health', healthCheckControllerHandler);
router.use('/v1', v1Routes);

export default { router };

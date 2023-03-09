import { Router } from 'express';
import { healthCheckController } from './healthCheck';

const router = Router();

router.use('/health', healthCheckController);

export default { router };

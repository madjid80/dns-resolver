import { Router } from 'express';
import { healthCheckControllerHandler } from './healthCheck';
import { serverInfoControllerHandler } from './info';
import { metricControllerHandler } from './metric';
import { NotFoundControllerHandler } from './notFound';
import v1Routes from './v1'
const router = Router();


router.get('/', serverInfoControllerHandler);
router.get('/metric', metricControllerHandler);
router.get('/health', healthCheckControllerHandler);
router.use('/v1', v1Routes);
router.use(NotFoundControllerHandler);

export default { router };

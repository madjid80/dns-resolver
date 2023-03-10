import { Router } from 'express';
import { lookupControllerHandler } from './lookup';
import { validateIpControllerHandler } from './validate';

const toolRouters = Router();

toolRouters.get('/lookup', lookupControllerHandler);
toolRouters.post('/validate', validateIpControllerHandler);

export { toolRouters };

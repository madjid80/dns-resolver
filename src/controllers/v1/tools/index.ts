import { Router } from 'express';
import { lookupControllerHandler } from './lookup';

const toolRouters = Router();

toolRouters.get('/lookup', lookupControllerHandler);

export { toolRouters };

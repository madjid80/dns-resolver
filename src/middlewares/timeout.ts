import { logger } from '@utils/logger';
import { NextFunction, Response, Request } from 'express';
function haltOnTimeout(req: Request, res: Response, next: NextFunction) {
  if (!req.timedout) {
    next();
  } else {
    logger.error({
      method: req.method,
      url: req.url,
      headers: req.headers,
      remoteAddress: req.ip,
      protocol: req.protocol,
      httpVersion: req.httpVersion,
      params: req.params,
      query: req.query,
      body: req.body,
      message: "Timeout happened!"
    })
  }
}

export { haltOnTimeout };

import { logger } from "@utils/logger";
import { NextFunction, Response, Request } from "express";

export const accessLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
    logger.info({
      method: req.method,
      url: req.url,
      headers: req.headers,
      remoteAddress: req.ip,
      protocol: req.protocol,
      httpVersion: req.httpVersion,
      params: req.params,
      query: req.query,
      body: req.body,
    });

    const originalSend = res.send;
    res.send = function (body):Response<any, Record<string, any>> {
        logger.info({ method: req.method, url: req.url, status: this.statusCode, controllerResult: body });
        return originalSend.call(this, body);
    };
    res.set('Content-Type', 'application/json');

    next();
  };
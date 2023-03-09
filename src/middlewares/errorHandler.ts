import { NextFunction, Response, Request } from 'express';

function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  if (req.timedout) {
    res.status(500).send({message: 'Timeout!'});
  } else {
    res.status(500).send({message: err.message});
  }
}
export { errorHandlerMiddleware };

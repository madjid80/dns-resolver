import { Request, Response } from 'express';

export const healthCheckControllerHandler = (req: Request, res: Response) => {
  res.status(200).send({message: 'Ok'});
};

import { Request, Response } from 'express';

export const NotFoundControllerHandler = (req: Request, res: Response) => {
  res.status(404).send({message: 'Page not found'});
};

import { Request, Response } from 'express';

export const serverInfoControllerHandler = (req: Request, res: Response) => {
  const response = {
    version: process.env.APP_VERSION || "0.1.0",
    date: new Date().getTime(),
    kubernetes: !!process.env.KUBERNETES_SERVICE_HOST
  }
  res.status(200).send(response);
};

import { Request, Response } from 'express';
import { logger } from '@utils/logger';
import { BadRequestError } from '@errors/badRequestError';
import { InternalError } from '@errors/internalServerError';
import { NotFoundError } from '@errors/notFoundError';
import { validateIPaddress } from '@services/ipValidator';

export const validateIpControllerHandler = async (req: Request, res: Response) => {
  logger.info('Validate controller handler started');
  try {
    console.log(req.body)
    if (!req.body.ip) {
      throw new BadRequestError('Ip missed in body, please send an ip to validate');
    }
    const { ip } = req.body;
    const isItValid = validateIPaddress(ip);
    !req.timedout && res.status(200).send({ status: isItValid });
  } catch (error) {
    logger.error('Error happened in validate Ip Controller Handler', error);
    if (error instanceof (BadRequestError || InternalError || NotFoundError)) {
      const status = (error as BadRequestError | InternalError | NotFoundError).status;
      const message = (error as BadRequestError | InternalError | NotFoundError).message;
      !req.timedout && res.status(status).send({ message });
    } else {
      !req.timedout && res.status(500).send({ message: (error as Error).message });
    }
  }
};

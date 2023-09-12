import { NextFunction, Request, Response } from 'express';

const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`Route: ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`Status Code: ${res.statusCode}`);
  });
  next();
};

// eslint-disable-next-line import/prefer-default-export
export { loggerMiddleware };

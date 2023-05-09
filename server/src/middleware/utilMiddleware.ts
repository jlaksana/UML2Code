import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

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

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000, // limit each IP to 1000 requests per minute
});

export { loggerMiddleware, limiter };

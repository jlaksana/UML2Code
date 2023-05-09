import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`Route: ${req.url}`);
  res.on('finish', () => {
    console.log(`Finished with Status Code: ${res.statusCode}`);
  });
  next();
};

const errorHandlerMiddleware = (error: Error, req: Request, res: Response) => {
  console.error(error);

  res.status(500).json({
    message: 'Internal server error. Try again later.',
  });
};

const limiter = rateLimit({
  windowMs: 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
});

export { loggerMiddleware, errorHandlerMiddleware, limiter };

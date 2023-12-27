import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserModel } from 'models/user.model';
import { DiagramModel } from '../models/diagram.model';

// Middleware to check if a user is authenticated
const withAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    if (decoded.userId === undefined) {
      console.log('Decoded user id is undefined');
      throw new Error();
    }
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new Error();
    }
    req.userId = decoded.userId;
    if (req.query.diagramId) {
      // check if diagram belongs to user
      const diagram = await DiagramModel.findOne({
        userId: req.userId,
        _id: req.query.diagramId,
      });
      if (!diagram) {
        throw new Error();
      }
    }
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized' });
    console.log(e);
  }
};

export default withAuth;

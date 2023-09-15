import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { DiagramModel } from '../models/diagram.model';

const withAuth: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error('No token provided');

    if (process.env.JWT_SECRET === undefined) {
      console.log('JWT secret is undefined');
      throw new Error();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    if (decoded.diagramId === undefined) {
      console.log('Decoded diagram id is undefined');
      throw new Error();
    }
    const diagram = await DiagramModel.findById(decoded.diagramId);
    if (!diagram) {
      throw new Error();
    }
    req.diagramId = decoded.diagramId;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized' });
    console.log(e);
  }
};

export default withAuth;

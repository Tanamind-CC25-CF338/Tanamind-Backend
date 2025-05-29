import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import response from '../response';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.token;

  if (!token) {
    response(401, null, 'Unauthorized: No token provided', res);
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      name: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT error:', error);
    response(403, null, 'Forbidden: Invalid token', res);
  }
};

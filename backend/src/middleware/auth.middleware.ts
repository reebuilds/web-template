import { Request, Response, NextFunction } from 'express';
import { verifyToken, UserPayload } from '../utils/jwt.utils';
import User from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // Add user to request
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ message: 'Not authorized, user not found' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
}; 
import { IUser } from '../models/user.model';
// Use CommonJS require
const jwt = require('jsonwebtoken');

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id.toString() }, 
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export interface UserPayload {
  id: string;
}

export const verifyToken = (token: string): UserPayload => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as UserPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}; 
import express from 'express';
import { updateUserProfile } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.put('/profile', protect, updateUserProfile);

export default router; 
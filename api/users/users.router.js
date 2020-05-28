import { Router } from 'express';
import { authController } from '../auth/auth.controller';
import { usersController } from './users.controller';

const router = Router();

router.get(
  '/current',
  authController.authorize,
  usersController.getCurrentUser,
);

export const usersRouter = router;

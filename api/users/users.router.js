import { Router } from 'express';
import { authController } from '../auth/auth.controller';
import { usersController } from './users.controller';

const router = Router();

router.get(
  '/current',
  authController.authorize,
  usersController.getCurrentUser,
);

router.patch(
  '/:id',
  authController.authorize,
  usersController.updateCurrentUser,
);

export const usersRouter = router;

import { Router } from 'express';
import { authController } from '../auth/auth.controller';
import { usersController } from './users.controller';
import { upload, compressImage } from '../auth/upload.middlewares';

const router = Router();

router.get(
  '/current',
  authController.authorize,
  usersController.getCurrentUser,
);

router.patch(
  '/avatars',
  upload.single('avatar'),
  authController.authorize,
  compressImage,
  usersController.updateUserAvatar,
);

router.patch(
  '/:id',
  authController.authorize,
  usersController.updateCurrentUser,
);

export const usersRouter = router;

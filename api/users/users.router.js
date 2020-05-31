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
  '/:id',
  authController.authorize,
  usersController.updateCurrentUser,
);

router.patch(
  '/avatars',
  authController.authorize,
  upload.single('avatar'),
  compressImage,
  usersController.updateUserAvatar,
);

export const usersRouter = router;

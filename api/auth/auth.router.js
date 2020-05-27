import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post(
  '/register',
  authController.validateRegisterUser,
  authController.registerUser,
);

router.post(
  '/login',
  authController.validateLoginUser,
  authController.loginUser,
);

router.patch('/logout', authController.authorize, authController.logoutUser);

export const authRouter = router;

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

export const authRouter = router;

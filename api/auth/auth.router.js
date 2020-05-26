import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

router.post(
  '/register',
  authController.validateRegisterUser,
  authController.registerUser,
);

export const authRouter = router;

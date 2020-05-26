import Joi from 'joi';
import bcryptjs from 'bcryptjs';
import { createControllerProxy } from '../helpers/controllerProxy';
import { userModel } from '../users/users.model';
import { ConflictError } from '../helpers/error.constructors';

class AuthController {
  constructor() {
    this._saltRounds = 5;
  }

  async registerUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        throw new ConflictError('Email in use');
      }

      const passwordHash = await this.hashPassword(password);
      const createdUser = await userModel.createUser({
        email,
        password: passwordHash,
      });

      return res.status(201).json({
        id: createdUser._id,
        email: createdUser.email,
        subscription: createdUser.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  async validateRegisterUser(req, res, next) {
    const userRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = Joi.validate(req.body, userRules);
    const message = 'missing required "email" or "password" field';
    if (validationResult.error) {
      return res.status(400).json({ message });
    }
    next();
  }

  async hashPassword(password) {
    return bcryptjs.hash(password, this._saltRounds);
  }
}

export const authController = createControllerProxy(new AuthController());

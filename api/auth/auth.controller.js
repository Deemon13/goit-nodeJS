import Joi from 'joi';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { createControllerProxy } from '../helpers/controllerProxy';
import { userModel } from '../users/users.model';
import {
  ConflictError,
  UnauthorizedError,
  NotFound,
} from '../helpers/error.constructors';

class AuthController {
  constructor() {
    this._saltRounds = 5;
  }

  async registerUser(req, res, next) {
    try {
      const { email, password, subscription } = req.body;

      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        throw new ConflictError('Email in use');
      }

      const passwordHash = await this.hashPassword(password);

      const avatarURL = `${process.env.SERVER_URL}/${process.env.COMPRESSED_IMAGES_BASE_URL}/${req.file}`;

      const createdUser = await userModel.createUser({
        email,
        password: passwordHash,
        subscription,
        avatarURL,
      });

      this.sendVerificationEmail(createdUser);

      const token = this.createToken(createdUser._id);
      await userModel.updateUserById(createdUser._id, { token });

      return res.status(201).json({
        user: this.composeUserForResponse(createdUser),
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyUser(req, res, next) {
    try {
      const { verificationToken } = req.params;

      const userToVerify = await userModel.findUserByVerificationToken(
        verificationToken,
      );

      if (!userToVerify) {
        throw new NotFound('Not found');
      }

      await userModel.verifyUser(verificationToken);

      return res.status(200).send('User successfully verified');
    } catch (err) {
      next(err);
    }
  }

  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const existingUser = await userModel.findUserByEmail(email);
      if (!existingUser) {
        throw new UnauthorizedError('Email is wrong');
      }
      const isPasswordCorrect = await this.comparePasswordsHash(
        password,
        existingUser.password,
      );
      if (!isPasswordCorrect) {
        throw new UnauthorizedError('Password is wrong');
      }

      const token = this.createToken(existingUser._id);

      await userModel.updateUserById(existingUser._id, { token });

      return res.status(200).json({
        token,
        user: this.composeUserForResponse(existingUser),
      });
    } catch (err) {
      next(err);
    }
  }

  async logoutUser(req, res, next) {
    try {
      await userModel.updateUserById(req.user._id, { token: null });

      return res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  async authorize(req, res, next) {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');

      try {
        jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        throw new UnauthorizedError('Not authorized. Token is not valid!');
      }

      const user = await userModel.findUserByToken(token);
      if (!user) {
        throw new UnauthorizedError('Not authorized. User not found! ');
      }

      req.user = user;
      req.token = token;

      next();
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
    const message = 'missing required email or password field';
    if (validationResult.error) {
      return res.status(400).json({ message });
    }
    next();
  }

  async validateLoginUser(req, res, next) {
    const userRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = Joi.validate(req.body, userRules);
    const message = 'missing required email or password field';
    if (validationResult.error) {
      return res.status(400).json({ message });
    }
    next();
  }

  async hashPassword(password) {
    return bcryptjs.hash(password, this._saltRounds);
  }

  async comparePasswordsHash(password, passwordHash) {
    return bcryptjs.compare(password, passwordHash);
  }

  async sendVerificationEmail(userEmail, verificationToken) {
    const verificationLink = `${process.env.SERVER_URL}/auth/verify/${verificationToken}`;
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.MAIL_LOGIN, pass: process.env.MAIL_PASSWORD },
    });

    const result = await transport.sendMail({
      from: `${process.env.MAIL_LOGIN}@gmail.com`,
      to: userEmail,
      subject: 'Please, verify your email!',
      html: `<a href="${verificationLink}">Verify email</a>`,
    });
  }

  createToken(uid) {
    return jwt.sign({ uid }, process.env.JWT_SECRET);
  }

  composeUserForResponse(user) {
    return {
      email: user.email,
      subscription: user.subscription,
    };
  }
}

export const authController = createControllerProxy(new AuthController());

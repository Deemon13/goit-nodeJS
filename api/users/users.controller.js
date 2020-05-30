import { createControllerProxy } from '../helpers/controllerProxy';
import { userModel } from './users.model';
import { UnauthorizedError } from '../helpers/error.constructors';

class UsersController {
  async getCurrentUser(req, res, next) {
    try {
      const existingUser = await userModel.findUserById(req.user._id);
      if (!existingUser) {
        throw new UnauthorizedError('Not authorized. User not found! ');
      }
      return res.status(200).json({
        user: this.composeUserForResponse(existingUser),
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCurrentUser(req, res, next) {
    const { subscription } = req.body;
    const { id } = req.params;
    const subTypes = ['free', 'pro', 'premium'];

    if (!subscription) {
      const message = 'No subscription!';
      return res.status(400).json({ message });
    }

    if (!subTypes.includes(subscription)) {
      const message = 'No such type of subscription!';
      return res.status(400).json({ message });
    }

    try {
      const existingUser = await userModel.findUserById(id);
      if (!existingUser) {
        throw new UnauthorizedError('Not authorized. User not found! ');
      }
      const updateContact = await userModel.updateUserById(id, {
        subscription,
      });
      return res.status(200).json({
        user: this.composeUserForResponse(updateContact),
      });
    } catch (err) {
      next(err);
    }
  }

  composeUserForResponse(user) {
    return {
      email: user.email,
      subscription: user.subscription,
    };
  }
}

export const usersController = createControllerProxy(new UsersController());

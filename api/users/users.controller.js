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

  composeUserForResponse(user) {
    return {
      email: user.email,
      subscription: user.subscription,
    };
  }
}

export const usersController = createControllerProxy(new UsersController());

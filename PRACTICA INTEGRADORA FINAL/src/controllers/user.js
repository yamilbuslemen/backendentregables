import handleAndLogError from "../utils/errorHandler.js";
import UserService from "../services/users.js";

class UserController {
  static async userUpgradeToPremium(req, res) {
    const { userId } = req.params;

    try {
      const user = await UserService.userUpgradeToPremium(userId);
      res.status(200).json({status: 'success', payload: user});
    } catch (error) {
      handleAndLogError(error);
      res.status(500).json({ status: 'error', payload: error.message });
    }
  }
}

export default UserController;
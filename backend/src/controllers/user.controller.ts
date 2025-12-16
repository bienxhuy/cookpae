// User controller
import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // Get user by ID
  // GET /users/:id
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const user = await this.userService.getUserById(userId);
      if (user) {
        res.json({ status: "success", data: user });
      } else {
        res.status(404).json({ status: "error", message: 'User not found' });
      }
    }
    catch (error) {
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Delete user by ID
  // DELETE /users/:id
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      await this.userService.removeUserById(userId);
      res.status(204).send();
    }
    catch (error) {
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }
}
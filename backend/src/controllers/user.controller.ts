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

  // Get all recipes created by user with pagination
  // GET /users/:id/recipes?page=1&pageSize=10
  async getUserRecipes(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      // Check if user exists
      const user = await this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ status: "error", message: 'User not found' });
        return;
      }

      const result = await this.userService.getUserRecipes(userId, page, pageSize);
      res.json({ status: "success", data: result });
    }
    catch (error) {
      console.error('Error fetching user recipes:', error);
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }

  // Get all recipes voted by user with pagination
  // GET /users/:id/recipes/voted?page=1&pageSize=10
  async getUserVotedRecipes(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.id, 10);
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      // Check if user exists
      const user = await this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ status: "error", message: 'User not found' });
        return;
      }

      const result = await this.userService.getUserVotedRecipes(userId, page, pageSize);
      res.json({ status: "success", data: result });
    }
    catch (error) {
      console.error('Error fetching user voted recipes:', error);
      res.status(500).json({ status: "error", message: 'Internal server error' });
    }
  }
}
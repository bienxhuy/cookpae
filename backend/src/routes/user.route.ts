// User route
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { AppDataSource } from '../data-source';

// Initialize repository, service, and controller using dependency injection
const userRepository = new UserRepository(AppDataSource);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Define routes
// TODO: Add authentication middleware 
const userRouter = Router();
userRouter.get('/:id', (req, res) => userController.getUser(req, res));
userRouter.delete('/:id', (req, res) => userController.deleteUser(req, res));

export default userRouter;

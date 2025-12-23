// User service
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/User';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async registerUser(name: string, email: string, password: string): Promise<User> {
    const user = new User(name, email, password);
    return this.userRepository.save(user);
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async removeUserById(id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  async getUserRecipes(userId: number, page: number = 1, pageSize: number = 10) {
    const { recipes, total } = await this.userRepository.findUserRecipes(userId, page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return {
      recipes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  async getUserVotedRecipes(userId: number, page: number = 1, pageSize: number = 10) {
    const { recipes, total } = await this.userRepository.findUserVotedRecipes(userId, page, pageSize);
    const totalPages = Math.ceil(total / pageSize);
    return {
      recipes,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }
}
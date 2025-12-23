// Vote service
import { VoteRepository } from '../repositories/vote.repository';
import { UserService } from './user.service';
import { Vote } from '../entities/Vote';
import { Recipe } from '../entities/Recipe';

export class VoteService {
  private voteRepository: VoteRepository;
  private userService: UserService;

  constructor(voteRepository: VoteRepository, userService: UserService) {
    this.voteRepository = voteRepository;
    this.userService = userService;
  }

  async addVote(userId: number, recipe: Recipe): Promise<void> {
    // Check if user exists
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already voted
    const existingVote = await this.voteRepository.findByUserAndRecipe(userId, recipe.id);
    if (existingVote) {
      throw new Error('User has already voted for this recipe');
    }

    // Create and save vote
    const vote = new Vote(user, recipe);
    await this.voteRepository.save(vote);
  }

  async removeVote(userId: number, recipeId: number): Promise<void> {
    // Check if vote exists
    const existingVote = await this.voteRepository.findByUserAndRecipe(userId, recipeId);
    if (!existingVote) {
      throw new Error('User has not voted for this recipe');
    }

    // Remove vote
    await this.voteRepository.delete(userId, recipeId);
  }
}

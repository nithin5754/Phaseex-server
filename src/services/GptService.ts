import {
  CreateGroupType,
  receivePromptQusType,
  receivePromptAnsType,
  TGetallPromptByGroup,
  GptType,
  AllGroupType,
} from "../Entities/Gpt";
import { IGptRepository } from "../interfaces/IGptRepository";

import { IGptService } from "../interfaces/IGptService";

export class GptService implements IGptService {
  private Repository: IGptRepository;
  constructor(Repository: IGptRepository) {
    this.Repository = Repository;
  }
  AllGroup(userId: string): Promise<AllGroupType[] | null> {
    return this.Repository.getAllGroup(userId);
  }
  getAddGroup(data: CreateGroupType): Promise<AllGroupType | null> {
    return this.Repository.addGroup(data);
  }
  getAddQuestions(
    data: receivePromptQusType
  ): Promise<{ promptId: string } | null> {
    return this.Repository.addQuestions(data);
  }
  getAddAnswers(data: receivePromptAnsType): Promise<boolean> {
    return this.Repository.addAnswers(data);
  }
  AllPromptByGroupId(data: TGetallPromptByGroup): Promise<GptType | null> {
    return this.Repository.getAllPromptByGroupId(data);
  }
}

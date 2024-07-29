import {
  AllGroupType,
  CreateGroupType,
  GptType,
  PromptType,
  receivePromptAnsType,
  receivePromptQusType,
  TGetallPromptByGroup,
} from "../Entities/Gpt";

export interface IGptRepository {
  addGroup(data: CreateGroupType): Promise<AllGroupType | null>;

  addQuestions(
    data: receivePromptQusType
  ): Promise<{ promptId: string } | null>;

  addAnswers(data: receivePromptAnsType): Promise<boolean>;

  getAllPromptByGroupId(data: TGetallPromptByGroup): Promise<GptType | null>;

  getAllGroup(userId: string): Promise<AllGroupType[] | null>;


}

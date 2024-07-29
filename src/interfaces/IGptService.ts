import { AllGroupType, CreateGroupType, GptType, PromptType, receivePromptAnsType, receivePromptQusType, TGetallPromptByGroup } from "../Entities/Gpt"




export interface IGptService {
  getAddGroup(data:CreateGroupType):Promise<AllGroupType|null>
 
  getAddQuestions(data:receivePromptQusType):Promise<{promptId:string}|null>

  getAddAnswers(data:receivePromptAnsType):Promise<boolean>

  AllPromptByGroupId(data:TGetallPromptByGroup):Promise<GptType|null>

  AllGroup(userId:string):Promise<AllGroupType[]|null>

}
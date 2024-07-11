import { CActivityType, CCommentType, ResponseActivityModal } from "../Entities/activity";
import IActivityRepository from "../Interfaces/IActivityRepository";
import { IActivityService } from "../Interfaces/IActivityService";



export class ActivityService implements IActivityService {
  private activityRepository:IActivityRepository
  constructor(activityRepository:IActivityRepository) {
    this.activityRepository=activityRepository
    
  }
  getAllActivity(workspaceId: string, folderId: string, listId: string, taskId: string): Promise<ResponseActivityModal | null> {
    return this.activityRepository.getAllActivity(workspaceId,folderId,listId,taskId)
  }
  getCreateActivity(data: CActivityType): Promise<boolean> {
   return this.activityRepository.createActivity(data)
  }
  getCreateComment(data: CCommentType): Promise<boolean> {
    return this.activityRepository.createComment(data)
  }
}
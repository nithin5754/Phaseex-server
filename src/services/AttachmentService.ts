import { AttachmentSliceType, SendAttachment } from "../Entities/attachment";
import { IAttachmentRepository } from "../interfaces/IAttachmentRepository";
import { IAttachmentService } from "../interfaces/IAttachmentService";




export class AttachmentService implements IAttachmentService {
   
  private attachmentRepo:IAttachmentRepository

  constructor(attachmentRepo:IAttachmentRepository){

    this.attachmentRepo=attachmentRepo

  }
  deleteSingleAttachment(workspaceId: string, folderId: string, listId: string, taskId: string, attachment_id: string): Promise<boolean> {
    return this.attachmentRepo.getDeleteSingleAttachment(workspaceId,folderId,listId,taskId,attachment_id)

  }
  getAllAttachmentInTaskId(workspaceId: string, folderId: string, listId: string, taskId: string): Promise<AttachmentSliceType | null> {
      
    return this.attachmentRepo.AllAttachmentInTaskId(workspaceId,folderId,listId,taskId)
  }



  getCreateAttachment(data: SendAttachment): Promise<boolean> {
     return this.attachmentRepo.createAttachment(data)

  }
  
}
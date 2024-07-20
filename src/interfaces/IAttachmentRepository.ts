import { Attachment, AttachmentSliceType, SendAttachment } from "../Entities/attachment";


export interface IAttachmentRepository {

  createAttachment(data:SendAttachment):Promise<boolean>

  AllAttachmentInTaskId(workspaceId:string,folderId:string,listId:string,taskId:string):Promise<AttachmentSliceType|null> 

  getDeleteSingleAttachment(workspaceId:string,folderId:string,listId:string,taskId:string,attachment_id:string):Promise<boolean>
  
}
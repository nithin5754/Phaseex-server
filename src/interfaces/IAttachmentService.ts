import { AttachmentSliceType, SendAttachment } from "../Entities/attachment";



export interface IAttachmentService {
  getCreateAttachment(data:SendAttachment):Promise<boolean>

  getAllAttachmentInTaskId(workspaceId:string,folderId:string,listId:string,taskId:string):Promise<AttachmentSliceType|null>

  deleteSingleAttachment(workspaceId:string,folderId:string,listId:string,taskId:string,attachment_id:string):Promise<boolean>
  
}


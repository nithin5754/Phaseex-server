import { Attachment, AttachmentSliceType, SendAttachment } from "../../../../Entities/attachment";
import { IAttachmentRepository } from "../../../../Interfaces/IAttachmentRepository";
import { Attachment as AttachmentModal } from "../models/AttachmentModal";




export class AttachmentRepository implements IAttachmentRepository {
async  getDeleteSingleAttachment(workspaceId: string, folderId: string, listId: string, taskId: string,attachment_id:string): Promise<boolean> {
    const filter = {
      _id: taskId,
      workspaceId: workspaceId,
      folderId: folderId,
      listId: listId,
      
    };

    const updateQuery = {
      $pull: {
        attachmentLists: {
          _id: attachment_id,
        },
      },
    };

    const response = await AttachmentModal.findOneAndUpdate(filter, updateQuery);

    if (response) {
      return true;
    }

    return false;
  }
async AllAttachmentInTaskId(workspaceId: string, folderId: string, listId: string, taskId: string): Promise<AttachmentSliceType | null> {
  
    let response=await AttachmentModal.findOne({workspaceId,folderId,listId,_id:taskId})
    
    if (response) {
      let responseData: AttachmentSliceType = {
        id: response._id.toString(),
        workspaceId: response.workspaceId?.toString() || '',
        folderId: response.folderId?.toString() || '',
        listId: response.listId?.toString() || '',
        taskId: response.taskId?.toString() || '',
        attachmentLists: response.attachmentLists.map((attachment: any) => ({
          id: attachment._id.toString(),
          name: attachment.name,
          description: attachment.description,
          url: attachment.url,
        })),
      };

      return responseData 
    }

    return null
    

 }
 async createAttachment(data:SendAttachment):Promise<boolean> {
    let response = await AttachmentModal.findOne({
      _id: data.taskId,
      workspaceId: data.workspaceId,
      folderId: data.folderId,
      listId: data.listId,
    });

    if (!response) {
   
      response = new AttachmentModal({
        _id: data.taskId,
        workspaceId: data.workspaceId,
        folderId: data.folderId,
        listId: data.listId,
        attachmentLists: [data.attachment],
      });

    let isSaved=  await response.save();
      return !!isSaved;
    } else {
      response.attachmentLists.push(data.attachment);
      let isSaved=   await response.save();
        
      return !!isSaved
    }
  }
  } 
import moment from "moment";
import { CActivityType, CCommentType, ResponseActivityModal } from "../../../../Entities/activity";
import IActivityRepository from "../../../../interfaces/IActivityRepository";

import { Activity as ActivityModal } from "../models/AcivityModal";

export class ActivityRepository implements IActivityRepository {
 async getAllActivity(workspaceId: string, folderId: string, listId: string, taskId: string): Promise<ResponseActivityModal|null> {
    let response = await ActivityModal.findOne({
      _id:taskId,
      workspaceId:workspaceId,
      folderId:folderId,
      listId:listId,

    });

    
    if(response){
      let responseData:ResponseActivityModal={
        id: response._id.toString() as string,
        workspaceId: response.workspaceId?.toString() as string,
        folderId: response.folderId?.toString() as string,
        listId: response.listId?.toString() as string,
        taskId:response.taskId?.toString() as string,
        activity:response.activity.map(
          (acti: any) => ({
            id: acti?._id?.toString(),
            message: acti.message,
            date: moment(acti.date).format("MMMM D, YYYY - h:mm A")
          })
        ),
      }

      return responseData
    }
    return null
  }
  async createComment(data: CCommentType): Promise<boolean> {
    let response = await ActivityModal.findOne({
      _id: data.taskId,
      workspaceId: data.workspaceId,
      folderId: data.folderId,
      listId: data.listId,
    });
    if (!response) {
   
      response = new ActivityModal({
        _id: data.taskId,
        workspaceId: data.workspaceId,
        folderId: data.folderId,
        listId: data.listId,
        comment: [data.comment],
      });
  
      await response.save();
      return true;
    } else {
      response.comment.push(data.comment);
      await response.save();
      return true;
    }
  }
  async createActivity(data: CActivityType): Promise<boolean> {
    let response = await ActivityModal.findOne({
      _id: data.taskId,
      workspaceId: data.workspaceId,
      folderId: data.folderId,
      listId: data.listId,
    });

    if (!response) {
   
      response = new ActivityModal({
        _id: data.taskId,
        workspaceId: data.workspaceId,
        folderId: data.folderId,
        listId: data.listId,
        activity: [data.activity],
      });
  
      await response.save();
      return true;
    } else {
      response.activity.push(data.activity);
      await response.save();
      return true;
    }
  }
}

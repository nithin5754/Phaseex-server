import { CActivityType, CCommentType, ResponseActivityModal } from "../Entities/activity"



export interface IActivityService {

  
getCreateActivity(data:CActivityType):Promise<boolean>

getCreateComment(data:CCommentType):Promise<boolean>


getAllActivity(workspaceId:string,
  folderId:string,
  listId:string,
  taskId:string
):Promise<ResponseActivityModal|null>

}
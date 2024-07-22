import { CreateTopComment, SendGetAllComment } from "../Entities/comment"



export interface ICommentService {
  
  getAddTopLevelComment(data:CreateTopComment):Promise<boolean>
   
  AddReplyToComment(data:SendGetAllComment,parentId:string):Promise<boolean>

  AllCommentInTodoId(data:SendGetAllComment):Promise<any>

  getCountAllComments(workspaceId:string,folderId:string,listId:string,taskId:string,todoId:string):Promise<number>

}
import { CommentList, CreateTopComment, SendGetAllComment } from "../Entities/comment";


export interface ICommentsRepo {

  addTopLevelComment(data:CreateTopComment):Promise<boolean>
   
  addReplyToComment(data:CreateTopComment,parentId:string):Promise<boolean>

  getAllCommentInTodoId(data:SendGetAllComment):Promise<CommentList[]|null>


  countAllComments(workspaceId:string,folderId:string,listId:string,taskId:string,todoId:string):Promise<number>

  



}
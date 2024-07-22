import { CreateTopComment, SendGetAllComment } from "../Entities/comment";
import { ICommentService } from "../Interfaces/ICommentService";
import { ICommentsRepo } from "../Interfaces/ICommentsRepo";

export class CommentsService implements ICommentService {
  private CommentsRepo: ICommentsRepo;
  constructor(CommentsRepo: ICommentsRepo) {
    this.CommentsRepo = CommentsRepo;
  }
  getCountAllComments(workspaceId: string, folderId: string, listId: string, taskId: string, todoId: string): Promise<number> {
    return  this.CommentsRepo.countAllComments(workspaceId,folderId,listId,taskId,todoId)
  }

  AllCommentInTodoId(data: SendGetAllComment): Promise<any> {
   return this.CommentsRepo.getAllCommentInTodoId(data)
  }

  getAddTopLevelComment(data: CreateTopComment): Promise<boolean> {
    return this.CommentsRepo.addTopLevelComment(data);
  }
  AddReplyToComment(
    data: CreateTopComment,
    parentId: string
  ): Promise<boolean> {
    return this.CommentsRepo.addReplyToComment(data, parentId);
  }
}

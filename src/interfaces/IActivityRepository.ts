import { CActivityType, CCommentType, ResponseActivityModal } from "../Entities/activity";



interface IActivityRepository {

createActivity(data:CActivityType):Promise<boolean>

createComment(data:CCommentType):Promise<boolean>

getAllActivity(workspaceId:string,
  folderId:string,
  listId:string,
  taskId:string
):Promise<ResponseActivityModal|null>







}

export default IActivityRepository;
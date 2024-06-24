import { TodoType } from "../Entities/Todo";
import { UserType } from "../Entities/Users";
import { STaskCollabType, WorkSpaceCollabType } from "../frameworks/database/mongodb/repository/searchRepository";




export interface ISearchService {


  getSearchUsers(searchKey:string):Promise<UserType[]|null>
  getSearchTodo(workspaceId: string, folderId: string, listId: string, taskId: string,todoKey:string): Promise<TodoType[] | null>
  getSearchCollaboratorInSpace(workspaceId:string,collabKey:string):Promise<WorkSpaceCollabType[]|null>
  getSearchCollaboratorInTask(workspaceId:string,folderId:string,listId:string,taskId:string,collabKey:string):Promise<STaskCollabType[]|null>


}
import { TodoType } from "../Entities/Todo";
import { UserType } from "../Entities/Users";
import { WorkspaceDataType } from "../Entities/WorkspaceDataType";
import { STaskCollabType, WorkSpaceCollabType } from "../frameworks/database/mongodb/repository/searchRepository";






export interface ISearchRepository {

  searchUsers(searchKey:string):Promise<UserType[]|null>
  searchTodo(workspaceId: string, folderId: string, listId: string, taskId: string,todoKey:string): Promise<TodoType[] | null>

  searchCollaboratorInSpace(workspaceId:string,collabKey:string):Promise<WorkSpaceCollabType[]|null>

  searchCollaboratorInTask(workspaceId:string,folderId:string,listId:string,taskId:string,collabKey:string):Promise<STaskCollabType[]|null>

}
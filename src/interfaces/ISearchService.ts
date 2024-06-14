import { TodoType } from "../Entities/Todo";
import { UserType } from "../Entities/Users";




export interface ISearchService {


  getSearchUsers(searchKey:string):Promise<UserType[]|null>
  getSearchTodo(workspaceId: string, folderId: string, listId: string, taskId: string,todoKey:string): Promise<TodoType[] | null>

}
import { TodoType } from "../Entities/Todo";
import { UserType } from "../Entities/Users";






export interface ISearchRepository {

  searchUsers(searchKey:string):Promise<UserType[]|null>
  searchTodo(workspaceId: string, folderId: string, listId: string, taskId: string,todoKey:string): Promise<TodoType[] | null>

}
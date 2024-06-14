import { TodoType } from "../Entities/Todo";



 export interface ITodoService {
  
  getAllTodoTask(workspaceId:string,folderId:string,listId:string,taskId:string):Promise<TodoType[]|null>

  
  getCreateTodoTask(todoTaskData:Partial<TodoType>):Promise<TodoType|null>
  getUpdateStatus(workspaceId:string,folderId:string,listId:string,taskId:string,todoId:string,todo_status:string):Promise<boolean>

  getUpdateTodoTask(workspaceId:string,folderId:string,listId:string,taskId:string,todoId:string,todo:string):Promise<boolean>

  getCheckDuplicateTodo(todoData:Partial<TodoType>):Promise<boolean>

  getDeleteTodoTask(   workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string):Promise<boolean>
  
 }
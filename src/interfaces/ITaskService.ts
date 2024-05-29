import { TaskType } from "../Entities/Task";



export interface  ITaskService {
  createTask(taskData:Partial<TaskType>):Promise<TaskType|null>

isExist(workspaceId:string,folderId:string,listId:string):Promise<boolean|null>
getDuplicateTask(workspaceId:string,folderId:string,listId:string,task_name:string):Promise<boolean>
}
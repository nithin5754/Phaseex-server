import { ListDataType } from "../Entities/List";
import { TaskType } from "../Entities/Task";



export interface  ITaskService {
  createTask(taskData:Partial<TaskType>):Promise<TaskType|null>

isExist(workspaceId:string,folderId:string,listId:string):Promise<boolean|null>
getDuplicateTask(workspaceId:string,folderId:string,listId:string,task_name:string):Promise<boolean>
getAllTask(workspaceId:string,folderId:string,listId:string):Promise<TaskType[]|null>

setTaskDateFromList(workspaceId:string,folderId:string,listId:string):Promise<ListDataType|null>
getUpdatePriority(workspaceId:string,folderId:string,listId:string,taskId:string,priority:string):Promise<boolean>


getUpdateTaskDate(workspaceId:string,folderId:string,listId:string,taskId:string,task_start_date:string,task_due_date:string):Promise<boolean>


}
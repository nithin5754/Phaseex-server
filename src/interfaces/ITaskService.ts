import { ListDataType } from "../Entities/List";
import { TaskType } from "../Entities/Task";



export interface  ITaskService {
  createTask(taskData:Partial<TaskType>):Promise<TaskType|null>

isExist(workspaceId:string,folderId:string,listId:string):Promise<boolean|null>
getDuplicateTask(workspaceId:string,folderId:string,listId:string,task_name:string):Promise<boolean>
getAllTask(workspaceId:string,folderId:string,listId:string):Promise<TaskType[]|null>

getAllCompleteTask(workspaceId:string,folderId:string,listId:string):Promise<number>

getUpdatePriority(workspaceId:string,folderId:string,listId:string,taskId:string,priority:string):Promise<boolean>

getUpdateStatus(workspaceId:string,folderId:string,listId:string,taskId:string,status:string):Promise<boolean>


getUpdateProgressTask(workspaceId:string,folderId:string,listId:string,getAllCompleteTask:number,allTaskCount:number):Promise<boolean>
getAllTaskCount(workspaceId:string,folderId:string,listId:string):Promise<number>

getTaskStatusWiseCount(workspaceId:string,folderId:string,listId:string):Promise<{"to-do":number,"in_progress":number,"complete":number}>





}
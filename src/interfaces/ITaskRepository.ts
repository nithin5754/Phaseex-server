


import {TaskType} from '../Entities/Task'

export interface ITaskRepository {

   createTask(taskData:Partial<TaskType>):Promise<TaskType|null>
   findDuplicateTask(workspaceId:string,folderId:string,listId:string,task_name:string):Promise<boolean>
   allTask(workspaceId:string,folderId:string,listId:string):Promise<TaskType[]|null>
   updatePriority(workspaceId:string,folderId:string,listId:string,taskId:string,priority:string):Promise<boolean>

   updateTaskDate(workspaceId:string,folderId:string,listId:string,   taskId:string,task_start_date:string,task_due_date:string):Promise<boolean>

   updateTaskDue(workspaceId:string,folderId:string,listId:string,taskId:string,due:number):Promise<boolean>

   
}



import {TaskType} from '../Entities/Task'

export interface ITaskRepository {

   createTask(taskData:Partial<TaskType>):Promise<TaskType|null>
   findDuplicateTask(workspaceId:string,folderId:string,listId:string,task_name:string):Promise<boolean>
   allTask(workspaceId:string,folderId:string,listId:string):Promise<TaskType[]|null>
   updatePriority(workspaceId:string,folderId:string,listId:string,taskId:string,priority:string):Promise<boolean>
   updateDescription(workspaceId:string,folderId:string,listId:string,taskId:string,task_description:string):Promise<boolean>
   updateStatus(workspaceId:string,folderId:string,listId:string,taskId:string,status:string):Promise<boolean>
   AllCompleteTask(workspaceId:string,folderId:string,listId:string):Promise<number>
   AllTaskCount(workspaceId:string,folderId:string,listId:string):Promise<number>
   TaskStatusWiseCount(workspaceId:string,folderId:string,listId:string):Promise<{"to-do":number,"in_progress":number,"complete":number}>


   singleTask(workspaceId:string,folderId:string,listId:string,taskId:string):Promise<TaskType|null>



   
}
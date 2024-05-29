


import {TaskType} from '../Entities/Task'

export interface ITaskRepository {

   createTask(taskData:Partial<TaskType>):Promise<TaskType|null>
   findDuplicateTask(workspaceId:string,folderId:string,listId:string,task_name:string):Promise<boolean>
}
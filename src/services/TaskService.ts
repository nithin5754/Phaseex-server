import { TaskType } from "../Entities/Task";
import { IListRepository } from "../Interfaces/IListRepository";
import { ITaskRepository } from "../Interfaces/ITaskRepository";
import { ITaskService } from "../Interfaces/ITaskService";


   
   export class TaskService implements ITaskService {

    private taskRepository:ITaskRepository
    private listRepository: IListRepository
    constructor( taskRepository:ITaskRepository,listRepository: IListRepository) {
       this.taskRepository=taskRepository
       this.listRepository=listRepository

    }
    async getDuplicateTask(workspaceId: string, folderId: string, listId: string, task_name: string): Promise<boolean> {
        let response=await this.taskRepository.findDuplicateTask(workspaceId,folderId,listId,task_name)
        return response
     }
    async isExist(workspaceId: string, folderId: string, listId: string): Promise<boolean | null> {
           
      let response=await this.listRepository.listExistById(workspaceId,folderId,listId)
      if(response){
        return true
      }
      return false
        
     }
    async  createTask(taskData: Partial<TaskType>): Promise<TaskType | null> {

      let response=await this.taskRepository.createTask(taskData)

      if(!response){
        return null
      }
      return response
     }
   }
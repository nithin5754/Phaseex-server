import { ListDataType } from "../Entities/List";
import { TaskType } from "../Entities/Task";
import { IDueDate } from "../Interfaces/IDueDate";
import { IListRepository } from "../Interfaces/IListRepository";
import { IProgressBar } from "../Interfaces/IProgressBar";
import { ITaskRepository } from "../Interfaces/ITaskRepository";
import { ITaskService } from "../Interfaces/ITaskService";


   
   export class TaskService implements ITaskService {

    private taskRepository:ITaskRepository
    private listRepository: IListRepository
    private dueDate:IDueDate;
    private progressBar:IProgressBar
    constructor( taskRepository:ITaskRepository,listRepository: IListRepository,dueDate:IDueDate,progressBar:IProgressBar) {
       this.taskRepository=taskRepository
       this.listRepository=listRepository
       this.dueDate=dueDate
       this.progressBar=progressBar

    }
    async getTaskStatusWiseCount(workspaceId: string, folderId: string, listId: string): Promise<{ "to-do": number; in_progress: number; complete: number; }> {
       
   let response=await this.taskRepository.TaskStatusWiseCount(workspaceId,folderId,listId)

      return response
         
     }
    async getAllTaskCount(workspaceId: string, folderId: string, listId: string): Promise<number> {
         let allTaskCount=await this.taskRepository.AllTaskCount(workspaceId, folderId, listId)

         return allTaskCount
     }

    async getAllCompleteTask(workspaceId: string, folderId: string, listId: string): Promise<number> {
         let allCompleteTask:number=await this.taskRepository.AllCompleteTask(workspaceId, folderId, listId)
         console.log(allCompleteTask,"all complete task")
         
      
         return allCompleteTask
          
     }
   async  getUpdateProgressTask(workspaceId: string, folderId: string, listId: string,getAllCompleteTask:number,allTaskCount:number): Promise<boolean> {
      let percentage=this.progressBar.calculateProgressBar(getAllCompleteTask,allTaskCount)
     
      if(percentage<1)percentage=0
    
      let updateTaskWithProgress=await this.listRepository.updateProgressTask(workspaceId,folderId,listId,percentage)
   



      return !!updateTaskWithProgress
     }
     async getUpdateStatus(workspaceId: string, folderId: string, listId: string, taskId: string, status: string): Promise<boolean> {
        
      let response=await this.taskRepository.updateStatus(workspaceId,folderId,listId,taskId,status)
      
      return response
     }

    async getUpdatePriority(
      workspaceId: string,
      folderId: string,
      listId: string,
      taskId:string,
      priority: string
    ): Promise<boolean> {
      let response = await this.taskRepository.updatePriority(
        workspaceId,
        folderId,
        listId,
        taskId,
        priority
      );
  
      return response;
    }
    async setTaskDateFromList(workspaceId: string, folderId: string, listId: string): Promise<ListDataType | null> {
      let response=await this.listRepository.singleList(workspaceId,folderId,listId) 

      if(!response){
        return null
      }

      return response
        
     }
    async getAllTask(workspaceId: string, folderId: string, listId: string): Promise<TaskType[] | null> {
       
      let response=await this.taskRepository.allTask(workspaceId,folderId,listId)
      if(response &&response.length>0){
        return response
      }
      return null
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
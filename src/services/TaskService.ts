import { ListDataType } from "../Entities/List";
import { TaskType } from "../Entities/Task";
import { IDueDate } from "../Interfaces/IDueDate";
import { IListRepository } from "../Interfaces/IListRepository";
import { ITaskRepository } from "../Interfaces/ITaskRepository";
import { ITaskService } from "../Interfaces/ITaskService";


   
   export class TaskService implements ITaskService {

    private taskRepository:ITaskRepository
    private listRepository: IListRepository
    private dueDate:IDueDate
    constructor( taskRepository:ITaskRepository,listRepository: IListRepository,dueDate:IDueDate) {
       this.taskRepository=taskRepository
       this.listRepository=listRepository
       this.dueDate=dueDate

    }
    async getUpdateTaskDate(
      workspaceId: string,
      folderId: string,
      listId: string,
      taskId:string,
      task_start_date: string,
      task_due_date: string
    ): Promise<boolean> {
      let response=await this.taskRepository.updateTaskDate(workspaceId,folderId,listId,taskId,task_start_date,task_due_date)

      let due:number=this.dueDate.useTimeDue(task_start_date,task_due_date)

        let updateResponse=await this.taskRepository.updateTaskDue(workspaceId,folderId,listId,taskId,due)


  
      return !!updateResponse&&!!response
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
       if(typeof taskData.task_due_date !=='string'||typeof taskData.task_start_date !=='string'){
        return null
       }
      let due=this.dueDate.useTimeDue(taskData.task_start_date,taskData.task_due_date)
      console.log(due,"due date for this task");
      

      let updateTaskData={...taskData, task_due:due>0?due:0}

      let response=await this.taskRepository.createTask(updateTaskData)

      if(!response){
        return null
      }
      return response
     }
   }
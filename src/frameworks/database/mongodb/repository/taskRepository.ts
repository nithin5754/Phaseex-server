import { TaskType } from "../../../../Entities/Task";
import { ITaskRepository } from "../../../../Interfaces/ITaskRepository";
import { Task as TaskModal } from "../models/TaskModal";
import moment  from "moment";




export class TaskRepository implements ITaskRepository  {
  constructor() {
    
  }
 async findDuplicateTask(workspaceId: string, folderId: string, listId: string, task_name: string): Promise<boolean> {
      
     let response=await TaskModal.find({workspaceId,folderId,listId,task_title:task_name})
     
     return !!response
  }
 async createTask(taskData: Partial<TaskType>): Promise<TaskType | null> {

     let response=await TaskModal.create(taskData)
     console.log(response,"hello");
     

     if(response){
    
       let responseData:TaskType={
         id: response._id.toString() as string,
         workspaceId: response.workspaceId?.toString() as string,
         folderId: response.folderId?.toString() as string,
         listId: response.listId?.toString() as string,
         priority_task: response.priority_task,
         status_task: response.status_task,
         task_start_date: response.task_start_date!,
         task_due_date: response.task_due_date!,
         task_description: response.task_description,
         task_due: response.task_due,
         task_activity: response.task_activity.map((activity: string) => activity),
         task_attachment: response.task_attachment.map((attachment: any) => (
           {
             attachment: attachment.attachment,
             file_name: attachment.file_name
           }
         )),
         task_collaborators: response.task_collaborators.map((collaborator: any) => ({
           assigneeId: collaborator.assigneeId.toString(),
           role: collaborator.role,
         })),
         createdAt: moment(response.createdAt).format("MMMM D, YYYY - h:mm A"),
         updatedAt: moment(response.updatedAt).format("MMMM D, YYYY - h:mm A"),
         task_title:response.task_title
       }

       return responseData

     }


     return null
      
     
      
  }




}
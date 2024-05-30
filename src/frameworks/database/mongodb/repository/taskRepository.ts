import { TaskType } from "../../../../Entities/Task";
import { ITaskRepository } from "../../../../Interfaces/ITaskRepository";
import { Task as TaskModal } from "../models/TaskModal";
import moment  from "moment";




export class TaskRepository implements ITaskRepository  {
  constructor() {
    
  }
 async updateTaskDue(workspaceId: string, folderId: string, listId: string, taskId: string, due: number): Promise<boolean> {
    const updateList = await TaskModal.findOneAndUpdate(
      { workspaceId, folderId, _id: taskId,listId },
      { $set: { task_due:due} },
      { new: true }
    );
 return !!updateList
  }
  async  updateTaskDate(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId:string,
    task_start_date: string,
    task_due_date: string
  ): Promise<boolean> {
   
     
    const updateList = await TaskModal.findOneAndUpdate(
      { workspaceId, folderId, _id: taskId,listId },
      { $set: { task_start_date,task_due_date } },
      { new: true }
    );
 return !!updateList

  }
  async updatePriority(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId:string,
    priority: string
  ): Promise<boolean> {

    const updateList = await TaskModal.findOneAndUpdate(
      { workspaceId, folderId, listId: listId,_id:taskId },
      { $set: { priority_task: priority } },
      { new: true }
    );
 console.log(updateList,"hey huiii");
 

    return !!updateList;
  }
 async allTask(workspaceId: string, folderId: string,listId:string): Promise<TaskType[] | null> {


    const response = await TaskModal.find({ workspaceId, folderId,listId })


    


    if(response){
      let responseData:TaskType[]=response.map((task)=>{
        return(
        {
          id: task._id.toString() as string,
          workspaceId: task.workspaceId?.toString() as string,
          folderId: task.folderId?.toString() as string,
          listId: task.listId?.toString() as string,
          priority_task: task.priority_task,
          status_task: task.status_task,
          task_start_date: task.task_start_date!,
          task_due_date: task.task_due_date!,
          task_description: task.task_description,
          task_due: task.task_due,
          task_activity: task.task_activity.map((activity: string) => activity),
          task_attachment: task.task_attachment.map((attachment: any) => (
            {
              attachment: attachment.attachment,
              file_name: attachment.file_name
            }
          )),
          task_collaborators: task.task_collaborators.map((collaborator: any) => ({
            assigneeId: collaborator.assigneeId.toString(),
            role: collaborator.role,
          })),
          createdAt: moment(task.createdAt).format("MMMM D, YYYY - h:mm A"),
          updatedAt: moment(task.updatedAt).format("MMMM D, YYYY - h:mm A"),
          task_title:task.task_title
        }
        )
      })
      return responseData
    }
    return null
  }
 async findDuplicateTask(workspaceId: string, folderId: string, listId: string, task_name: string): Promise<boolean> {
      
     let response=await TaskModal.findOne({workspaceId,folderId,listId,task_title:task_name})
     console.log(response,"hello mollu");
     
     return !!response
  }
 async createTask(taskData: Partial<TaskType>): Promise<TaskType | null> {

     let response=await TaskModal.create(taskData)
     
     

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
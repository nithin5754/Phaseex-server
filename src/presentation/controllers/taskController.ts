import { NextFunction, Request, Response } from "express";
import { ITaskService } from "../../Interfaces/ITaskService";



  export class TaskController {
     
    private taskService:ITaskService
    constructor(taskService:ITaskService) {
      this.taskService=taskService
      
    }

    onCreateNewTask = async (req: Request, res: Response, next: NextFunction) => {



      console.log(req.body,"req,body");
      
      if(!req.body){
        return res.status(404).json({message:" please try after some times"})
      }
      if (!req.body.task_title.trim() || !req.body.task_description.trim()) {
        return res.status(404).json({message:"full space invalid "})
      }
         try {

          let isExist=await this.taskService.isExist(req.body.workspaceId,req.body.folderId,req.body.listId)
          if(!isExist){
            return res.status(404).json({message:"not found something went wrong please try after sometimes"})
          }

          let duplicate=await this.taskService.getDuplicateTask(req.body.workspaceId,req.body.folderId,req.body.listId,req.body.task_title)

          if(duplicate){
            return res.status(404).json({message:"already exis"})
          }
           
          let response =await this.taskService.createTask({...req.body})
          if(!response){
            return res.status(404).json({message:"error in creating new task"})
          }

          return res.status(200).json(response)
         
         } catch (error) {
          next(Error)
         }
    }
  }
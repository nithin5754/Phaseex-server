import { NextFunction, Request, Response } from "express";
import { ITaskService } from "../../Interfaces/ITaskService";
import { log } from "console";

export class TaskController {
  private taskService: ITaskService;
  constructor(taskService: ITaskService) {
    this.taskService = taskService;
  }

  onCreateNewTask = async (req: Request, res: Response, next: NextFunction) => {
  

    if (!req.body) {
      return res.status(404).json({ message: " please try after some times" });
    }
    if (!req.body.task_title.trim() || !req.body.task_description.trim()) {
      return res.status(404).json({ message: "full space invalid " });
    }
    try {
      let isExist = await this.taskService.isExist(
        req.body.workspaceId,
        req.body.folderId,
        req.body.listId
      );
      if (!isExist) {
        return res
          .status(404)
          .json({
            message:
              "not found something went wrong please try after sometimes",
          });
      }

      let duplicate = await this.taskService.getDuplicateTask(
        req.body.workspaceId,
        req.body.folderId,
        req.body.listId,
        req.body.task_title
      );

      if (duplicate) {
        return res.status(404).json({ message: "already exist" });
      }


       let setTaskDate=await  this.taskService.setTaskDateFromList(req.body.workspaceId,
        req.body.folderId,
        req.body.listId)
        if(!setTaskDate){
          return res.status(404).json({message:"something went wrong please try again!"})
        }


      
  
      let response = await this.taskService.createTask({ ...req.body,task_start_date:setTaskDate.list_start_date,task_due_date:setTaskDate.list_due_date });
      if (!response) {
        return res.status(404).json({ message: "error in creating new task" });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onGetAllTheTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { workspaceId, folderId, listId } = req.query;
    
      
      if (!workspaceId || !folderId || !listId) {
        return res
          .status(404)
          .json({ message: "invalid credentials please try again!!" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string"
      ) {
        return res
          .status(404)
          .json({ message: "something went wrong please try after sometimes" });
      }
      let allTask =await this.taskService.getAllTask(workspaceId, folderId, listId);


      if (!allTask) {
        return res.status(404).json({ message: "task empty" });
      }

      return res.status(200).json(allTask);
    } catch (error) {
      next(error);
    }
  };



  onUpdatePriorityTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let taskId = req.params.taskId;
      let { folderId, workspaceId,listId, priority } = req.body;

      
  

      if (!listId || !folderId || !workspaceId || !priority) {
        return res
          .status(400)
          .json({
            message: "credentials missing  please try again after some times",
          });
      }

      let response = await this.taskService.getUpdatePriority(
        workspaceId,
        folderId,
        listId,
        taskId,
        priority
      );

      if (!response) {
        return res.status(404).json({
          message: "error in updating priority task",
        });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };


  onUpdateTaskDate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let taskId = req.params.taskId;
      let { folderId, workspaceId,listId, task_start_date, task_due_date } = req.body;

      console.log(taskId,req.body,"task data");
      
 
      if (
        !listId ||
        !folderId ||
        !taskId||
        !workspaceId ||
        !task_start_date ||
        !task_due_date
      ) {
        return res
          .status(400)
          .json({
            message: "credentials missing  please try again after some times",
          });
      }

      


      let response = await this.taskService.getUpdateTaskDate(
        workspaceId,
        folderId,
        listId,
        taskId,
        task_start_date,
        task_due_date
      );

      if (!response) {
        return res.status(404).json({
          message: "error in updating start and due date in task",
        });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };


}

import { NextFunction, Request, Response } from "express";
import { ITaskService } from "../../Interfaces/ITaskService";
import { IProgressBar } from "../../Interfaces/IProgressBar";

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
        return res.status(404).json({
          message: "not found something went wrong please try after sometimes",
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

      let response = await this.taskService.createTask({ ...req.body });
      if (!response) {
        return res.status(404).json({ message: "error in creating new task" });
      }



      let getAllCompleteTask = await this.taskService.getAllCompleteTask(
        req.body.workspaceId,
        req.body.folderId,
        req.body.listId
      );

      if (!getAllCompleteTask) {
        getAllCompleteTask = 0;
      }

      let allTaskCount = await this.taskService.getAllTaskCount(
        req.body.workspaceId,
        req.body.folderId,
        req.body.listId
      );

      if (!allTaskCount) {
        allTaskCount = 0;
      }

      let updateProgressBar = await this.taskService.getUpdateProgressTask(
        req.body.workspaceId,
        req.body.folderId,
        req.body.listId,
        getAllCompleteTask,
        allTaskCount
      );

      if (!updateProgressBar) {
        return res.status(409).json({ message: "something went wrong!" });
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
      let allTask = await this.taskService.getAllTask(
        workspaceId,
        folderId,
        listId
      );

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
      let { folderId, workspaceId, listId, priority } = req.body;

      if (!listId || !folderId || !workspaceId || !priority) {
        return res.status(400).json({
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

  onUpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let taskId = req.params.taskId;
      let { folderId, workspaceId, listId, status } = req.body;

      if (!listId || !folderId || !workspaceId || !status) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      let isUpdateStatus = await this.taskService.getUpdateStatus(
        workspaceId,
        folderId,
        listId,
        taskId,
        status
      );

      if (!isUpdateStatus) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again" });
      }

      let getAllCompleteTask = await this.taskService.getAllCompleteTask(
        workspaceId,
        folderId,
        listId
      );

      if (!getAllCompleteTask) {
        getAllCompleteTask = 0;
      }

      let allTaskCount = await this.taskService.getAllTaskCount(
        workspaceId,
        folderId,
        listId
      );

      if (!allTaskCount) {
        allTaskCount = 0;
      }

      let updateProgressBar = await this.taskService.getUpdateProgressTask(
        workspaceId,
        folderId,
        listId,
        getAllCompleteTask,
        allTaskCount
      );

      if (!updateProgressBar) {
        return res.status(409).json({ message: "something went wrong!" });
      }

      return res.status(200).json(updateProgressBar);
    } catch (error) {
      next(error);
    }
  };

  onGetAllTaskWiseCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId } = req.query;
      if (!listId || !folderId || !workspaceId) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string"
      ) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again" });
      }

      let getAllTaskCountWise: {
        "to-do": number;
        "in_progress": number;
        "complete": number;
      } = await this.taskService.getTaskStatusWiseCount(
        workspaceId,
        folderId,
        listId
      );

      if (!getAllTaskCountWise) {
        return res
          .status(400)
          .json({ message: "something went wrong please try again " });
      }

      return getAllTaskCountWise;
    } catch (error) {
      next(error);
    }
  };
}

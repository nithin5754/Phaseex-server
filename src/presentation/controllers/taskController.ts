import { NextFunction, Request, Response } from "express";
import { ITaskService } from "../../Interfaces/ITaskService";
import { IProgressBar } from "../../Interfaces/IProgressBar";
import { TaskCollaboratorType } from "../../Entities/Task";
import cloudinary from 'cloudinary'

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
        in_progress: number;
        complete: number;
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

  onSingleList = async (req: Request, res: Response, next: NextFunction) => {
    const { workspaceId, folderId, listId, taskId } = req.query;

    if (!workspaceId || !folderId || !listId || !taskId) {
      return res
        .status(404)
        .json({ message: "credentials missing please try again " });
    }

    if (
      typeof workspaceId !== "string" ||
      typeof folderId !== "string" ||
      typeof listId !== "string" ||
      typeof taskId !== "string"
    ) {
      return res
        .status(404)
        .json({ message: "something went wrong please try after sometimes" });
    }
    try {
      const response = await this.taskService.getSingleTask(
        workspaceId,
        folderId,
        listId,
        taskId
      );

      if (!response) {
        return res.status(404).json({ message: "task not found" });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onUpdateDescriptionTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let taskId = req.params.taskId;
      let { folderId, workspaceId, listId, task_description } = req.body;

      if (!listId || !folderId || !workspaceId || !task_description) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      let response = await this.taskService.getUpdateDescription(
        workspaceId,
        folderId,
        listId,
        taskId,
        task_description
      );

      if (!response) {
        return res.status(404).json({
          message: "error in updating description task",
        });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onAddCollaboratorsToTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { taskId } = req.params;

      const { workspaceId, folderId, listId, collabId } = req.body;

      if (!workspaceId || !folderId || !listId || !collabId || !taskId) {
        return res.status(404).json({ message: "missing credential" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof collabId !== "string" ||
        typeof taskId !== "string"
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }

      let isCollabExistAsViewer =
        await this.taskService.isCollabExistInListAsViewer(
          workspaceId,
          folderId,
          listId,
          collabId
        );

      if (isCollabExistAsViewer) {
        return res
          .status(400)
          .json({ message: "cannot add : this user is viewer as role " });
      }

      let isExist = await this.taskService.getSingleTask(
        workspaceId,
        folderId,
        listId,
        taskId
      );

      if (!isExist) {
        return res
          .status(400)
          .json({ message: "workspace not found please try again" });
      }

      const existingCollaborator = isExist.task_collaborators.find(
        (collab: TaskCollaboratorType) => collab.assigneeId === collabId
      );

      if (existingCollaborator) {
        return res.status(404).json({ message: "already exist " });
      }

      const response = await this.taskService.getAddCollabToTask(
        workspaceId,
        folderId,
        listId,
        taskId,
        collabId
      );

      if (!response) {
        return res
          .json(404)
          .json({ message: "something error occur please try later" });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onGetCollabByTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId, taskId } = req.query;

      if (!workspaceId || !folderId || !listId || !taskId) {
        return res.status(404).json({ message: "missing credential" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof taskId !== "string"
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }

      let response = await this.taskService.getTaskCollabByListId(
        workspaceId,
        folderId,
        listId,
        taskId
      );

      if (!response) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again later" });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onDeleteCollabIdTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId, taskId } = req.body;

      const collabId = req.params.collabId;

      if (!workspaceId || !folderId || !listId || !taskId || !collabId) {
        return res.status(404).json({ message: "missing credential" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof collabId !== "string" ||
        typeof taskId !== "string"
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }

      let response = await this.taskService.getDeleteTaskCollabByTaskId(
        workspaceId,
        folderId,
        listId,
        taskId,
        collabId
      );

      if (!response) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again" });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onTaskCollabListGrp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId} = req.query;

      let collaboratorId=req.userId

      if (!workspaceId || !folderId || !listId || !collaboratorId) {
        return res.status(404).json({ message: "missing credential" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof collaboratorId !== "string"
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }

      let isCollabExist = await this.taskService.getCheckCollaboratorInTasks(
        workspaceId,
        folderId,
        listId,
        collaboratorId
      );


      console.log(isCollabExist,"is collab-grp -list exits")

      return res.status(200).json(isCollabExist);
    } catch (error) {
      next(error);
    }
  };


  onAddLinkToTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { taskId } = req.params;

      const { workspaceId, folderId, listId,link,link_name } = req.body;

      console.log(req.body,"hello list link")

      if (!workspaceId || !folderId || !listId || !link || !taskId||!link_name) {
        return res.status(404).json({ message: "missing credential" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof link !== "string" ||
        typeof taskId !== "string"||
        typeof link_name !=='string'
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }


      const response = await this.taskService.addTaskLink(
        workspaceId,
        folderId,
        listId,
        taskId,
        link,
        link_name
      );

      if (!response) {
        return res
          .json(404)
          .json({ message: "something error occur please try later" });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };




  onDeleteLinkTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId,linkId  } = req.body;

      const taskId = req.params.taskId;

      console.log(req.body,taskId,"delete link task.....")

      if (!workspaceId || !folderId || !listId || !taskId || !linkId) {
        return res.status(404).json({ message: "missing credential" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof linkId !== "string" ||
        typeof taskId !== "string"
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }

      let response = await this.taskService.getDeleteTaskLink(
        workspaceId,
        folderId,
        listId,
        taskId,
        linkId
      );

      if (!response) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again" });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };






}

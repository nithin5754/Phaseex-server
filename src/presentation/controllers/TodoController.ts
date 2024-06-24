import { NextFunction, Request, Response } from "express";
import { ITodoService } from "../../Interfaces/ITodoService";

export class TodoController {
  private todoService: ITodoService;
  constructor(todoService: ITodoService) {
    this.todoService = todoService;
  }

  onGetAllTodoTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { workspaceId, folderId, listId, taskId } = req.query;

    if (!workspaceId || !folderId || !listId || !taskId) {
      return res
        .status(404)
        .json({ message: "invalid credentials please try again!!" });
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
      const allTask = await this.todoService.getAllTodoTask(
        workspaceId,
        folderId,
        listId,
        taskId
      );

      if (!allTask) {
        return res.status(404).json({ message: "not found" });
      }

      return res.status(200).json(allTask);
    } catch (error) {
      next(error);
    }
  };

  onCreateTodoTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.body) {
      return res.status(404).json({ message: " please try after some times" });
    }

    try {
      let isTodoTaskExist = await this.todoService.getCheckDuplicateTodo({
        ...req.body,
      });

      if (isTodoTaskExist) {
        return res.status(400).json({ message: "already exist" });
      }

      let response = await this.todoService.getCreateTodoTask({
        ...req.body,
        todo: req.body.todo.toLowerCase(),
      });

      if (!response) {
        return res
          .status(404)
          .json({ message: "error in creating new task todo" });
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onUpdateTodoStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let todoId = req.params.todoId;
      let { folderId, workspaceId, listId, taskId, todo_status } = req.body;

      console.log(todoId, req.body, "hello00000000000000000");

      if (
        !listId ||
        !folderId ||
        !workspaceId ||
        !todo_status ||
        !taskId ||
        !todoId
      ) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      const response = await this.todoService.getUpdateStatus(
        workspaceId,
        folderId,
        listId,
        taskId,
        todoId,
        todo_status
      );

      if (!response) {
        return res.status(404).json({
          message: "something ent wrong ! please try again after some times",
        });
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onUpdateTodoTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let todoId = req.params.todoId;
      let { folderId, workspaceId, listId, taskId, todo } = req.body;

      if (!listId || !folderId || !workspaceId || !todo || !taskId || !todoId) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      let isTodoTaskExist = await this.todoService.getCheckDuplicateTodo({
        ...req.body,
      });

      if (isTodoTaskExist) {
        return res.status(400).json({ message: "already exist" });
      }

      const response = await this.todoService.getUpdateTodoTask(
        workspaceId,
        folderId,
        listId,
        taskId,
        todoId,
        todo
      );

      if (!response) {
        return res.status(404).json({
          message: "something ent wrong ! please try again after some times",
        });
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onDeleteTodoTask = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let todoId = req.params.todoId;
    let { folderId, workspaceId, listId, taskId } = req.body;
    try {
      if (!listId || !folderId || !workspaceId || !taskId || !todoId) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      let response = await this.todoService.getDeleteTodoTask(
        workspaceId,
        folderId,
        listId,
        taskId,
        todoId
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

  onAddCollabToTodo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let todoId = req.params.todoId;
      let { folderId, workspaceId, listId, taskId, collabId } = req.body;

      if (
        !listId ||
        !folderId ||
        !workspaceId ||
        !taskId ||
        !todoId ||
        !collabId
      ) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      let response = await this.todoService.getAddCollabToTodo(
        workspaceId,
        folderId,
        listId,
        taskId,
        todoId,
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
}

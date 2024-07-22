import { NextFunction, Request, Response } from "express";
import { ICommentService } from "../../interfaces/ICommentService";
import { CreateTopComment, SendGetAllComment } from "../../Entities/comment";
import IAuthUserService from "../../interfaces/IAuthService";
import { AuthServices } from "../../services/AuthServices";

export class CommentsController {
  private commentService: ICommentService;
  private userService: IAuthUserService;
  constructor(commentService: ICommentService, userService: IAuthUserService) {
    this.commentService = commentService;
    this.userService = userService;
  }

  onAddTopLevelComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId, taskId, message } = req.body;
      const userId = req.userId;
      const todoId = req.params.todoId;

      if (
        !listId ||
        !folderId ||
        !workspaceId ||
        !todoId ||
        !taskId ||
        !message ||
        !userId
      ) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      let isCurrentUser = await this.userService.findUserById(userId);

      if (isCurrentUser) {
        let data: CreateTopComment = {
          workspaceId,
          folderId,
          listId,
          taskId,
          todoId,
          message,
          userId: isCurrentUser.userName,
        };

        let isCreateTopLevelComment =
          await this.commentService.getAddTopLevelComment(data);

        if (!isCreateTopLevelComment) {
          return res.status(404).json({
            message: "something went wrong please try after sometimes",
          });
        }

        return res.status(200).json(isCreateTopLevelComment);
      }
    } catch (error) {
      next(error);
    }
  };

  onAddReplyLevelComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId, taskId, message, parentId } =
        req.body;

      const todoId = req.params.todoId;

      const userId = req.userId;

      if (
        !listId ||
        !folderId ||
        !workspaceId ||
        !todoId ||
        !taskId ||
        !message ||
        !userId ||
        !parentId
      ) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      let isCurrentUser = await this.userService.findUserById(userId);

      if (isCurrentUser) {
        let data: CreateTopComment = {
          workspaceId,
          folderId,
          listId,
          taskId,
          todoId,
          message,
          userId: isCurrentUser.userName,
        };

        let isCreateTopLevelComment =
          await this.commentService.AddReplyToComment(data, parentId);

        if (!isCreateTopLevelComment) {
          return res.status(404).json({
            message: "something went wrong please try after sometimes",
          });
        }

        return res.status(200).json(isCreateTopLevelComment);
      }
    } catch (error) {
      next(error);
    }
  };

  onGetAllCommentByTodoId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId, taskId, todoId } = req.query;

      if (
        !listId ||
        !folderId ||
        !workspaceId ||
        !todoId ||
        !taskId ||
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof taskId !== "string" ||
        typeof todoId !== "string"
      ) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      let data: SendGetAllComment = {
        workspaceId,
        folderId,
        listId,
        taskId,
        todoId,
      };

      let getAllComment = await this.commentService.AllCommentInTodoId(data);

      if (!getAllComment) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again" });
      }

      return res.status(200).json(getAllComment);
    } catch (error) {
      next(error);
    }
  };

  onGetCountAllDocuments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId, taskId, todoId } = req.query;
      if (
        !listId ||
        !folderId ||
        !workspaceId ||
        !todoId ||
        !taskId ||
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof taskId !== "string" ||
        typeof todoId !== "string"
      ) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      let count = await this.commentService.getCountAllComments(
        workspaceId,
        folderId,
        listId,
        taskId,
        todoId
      );
      return res.status(200).json(count);
    } catch (error) {
      next(error);
    }
  };
}

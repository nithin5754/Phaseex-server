import { NextFunction, Request, Response } from "express";
import { IListService } from "../../interfaces/IListService";


export class ListController {
  private listService: IListService;
  constructor(
    listService: IListService,

  ) {
    this.listService = listService;
  }

  onCreateList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { workspaceId, folderId, listData } = req.body;
      const userId = req.userId;
      if (
        !listData.list_title.trim() ||
        !listData.list_description.trim() ||
        !userId
      ) {
        return res.status(404).json({ message: "full space invalid" });
      }

      const isDuplicateList = await this.listService.isListExist(
        workspaceId,
        folderId,
        listData.list_title
      );

      if (isDuplicateList) {
        return res.status(404).json({ message: "already exist" });
      }



      const createNewList = await this.listService.createList(
        workspaceId,
        folderId,
        userId,
        listData
      );
      if (!createNewList) {
        return res
          .status(400)
          .json({ message: "error creating new List please try again.." });
      }

      return res.status(200).json(createNewList);
    } catch (error) {
      next(error);
    }
  };

  onGetAllList = async (req: Request, res: Response, next: NextFunction) => {
    const { workspaceId, folderId } = req.query;
    if (!workspaceId || !folderId) {
      return res
        .status(404)
        .json({ message: "invalid credentials please try again!!" });
    }

    try {
      const response = await this.listService.getallList(
        workspaceId as string,
        folderId as string
      );
      if (!response) {
        res.status(400).json({ message: "not found" });
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onGetAllListPage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { workspaceId, folderId, page } = req.query;
    if (!workspaceId || !folderId || !page) {
      return res
        .status(404)
        .json({ message: "invalid credentials please try again!!" });
    }
    try {
      const response = await this.listService.getAllListPage(
        workspaceId as string,
        folderId as string,
        page as string
      );
      if (!response || response.lists === null || response.lists.length === 0) {
        return res.status(400).json({ message: "not found" });
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onUpdatePriorityList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const listId = req.params.listId;
      const { folderId, workspaceId, priority } = req.body;

      if (!listId || !folderId || !workspaceId || !priority) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      const response = await this.listService.getUpdatePriority(
        workspaceId,
        folderId,
        listId,
        priority
      );

      if (!response) {
        return res.status(404).json({
          message: "error in updating priority list",
        });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onUpdateListDate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const listId = req.params.listId;
      const { folderId, workspaceId, list_start_date, list_due_date } =
        req.body;

      if (
        !listId ||
        !folderId ||
        !workspaceId ||
        !list_start_date ||
        !list_due_date
      ) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }
      const response = await this.listService.getUpdateListDate(
        workspaceId,
        folderId,
        listId,
        list_start_date,
        list_due_date
      );

      if (!response) {
        return res.status(404).json({
          message: "error in updating start and due date in list",
        });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onGetSingleList = async (req: Request, res: Response, next: NextFunction) => {
    const { workspaceId, folderId, listId } = req.query;

    if (!workspaceId || !folderId || !listId) {
      return res.status(404).json({ message: "missing credential" });
    }

    if (
      typeof workspaceId !== "string" ||
      typeof folderId !== "string" ||
      typeof listId !== "string"
    ) {
      return res.status(404).json({
        message: "wrong credentials please try again after some times",
      });
    }
    try {
      const singleList = await this.listService.getSingleList(
        workspaceId,
        folderId,
        listId
      );

      if (!singleList) {
        return res
          .status(400)
          .json({ message: "list not found ,please try again" });
      }

      return res.status(200).json(singleList);
    } catch (error) {
      next(error);
    }
  };

  onGetDeleteList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const listId = req.params.listId;
      const { workspaceId, folderId } = req.body;

      if (!listId || !workspaceId || !folderId) {
        return res.status(404).json({ message: "credentials missing" });
      }

      const isListDeleted = await this.listService.getDeleteList(
        workspaceId,
        folderId,
        listId
      );

      if (!isListDeleted) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again" });
      }

      return res.status(200).json(isListDeleted);
    } catch (error) {
      next(error);
    }
  };

  onAddMembersToList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const listId = req.params.listId;
      const { workspaceId, folderId, memberId, role } = req.body;

      if (!listId || !workspaceId || !memberId || !folderId || !role) {
        return res.status(404).json({ message: "credentials missing" });
      }

      const response = await this.listService.addManagerViewerList(
        workspaceId,
        folderId,
        listId,
        memberId,
        role
      );

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}

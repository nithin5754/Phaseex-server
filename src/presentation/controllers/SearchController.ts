import { NextFunction, Request, Response } from "express";
import { ISearchService } from "../../interfaces/ISearchService";

export class SearchController {
  private searchService: ISearchService;
  constructor(searchService: ISearchService) {
    this.searchService = searchService;
  }

  onSearchUsers = async (req: Request, res: Response, next: NextFunction) => {
    const searchKey = req.params.searchKey;

    if (!searchKey) {
      return res
        .status(404)
        .json({ message: "credentials missing please try again later!" });
    }
    try {
      let response = await this.searchService.getSearchUsers(
        searchKey.toLowerCase()
      );
      if (!response) {
        return res.status(400).json({ message: "not found" });
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onSearchTodo = async (req: Request, res: Response, next: NextFunction) => {
    const { workspaceId, folderId, listId, taskId, todoKey } = req.query;

    if (!workspaceId || !folderId || !listId || !taskId || !todoKey) {
      return res
        .status(404)
        .json({ message: "invalid credentials please try again!!" });
    }

    if (
      typeof workspaceId !== "string" ||
      typeof folderId !== "string" ||
      typeof listId !== "string" ||
      typeof taskId !== "string" ||
      typeof todoKey !== "string"
    ) {
      return res
        .status(404)
        .json({ message: "something went wrong please try after sometimes" });
    }

    let response = await this.searchService.getSearchTodo(
      workspaceId,
      folderId,
      listId,
      taskId,
      todoKey.toLowerCase()
    );
    if (!response) {
      return res.status(400).json({ message: "not found" });
    }
    return res.status(200).json(response);
  };

  onSearchSpaceCollab = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, collabKey } = req.query;

      if (!workspaceId || !collabKey) {
        return res
          .status(404)
          .json({ message: "invalid credentials please try again!!" });
      }

      if (typeof workspaceId !== "string" || typeof collabKey !== "string") {
        return res
          .status(404)
          .json({ message: "something went wrong please try after sometimes" });
      }
      const response = await this.searchService.getSearchCollaboratorInSpace(
        workspaceId,
        collabKey
      );
      if (!response) {
        return res.status(404).json({ message: "search item not found" });
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };



  onSearchTaskCollab = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    const { workspaceId, folderId, listId, taskId,collabKey } = req.query;
   

    if (!workspaceId || !folderId || !listId || !taskId||!collabKey) {
      return res
        .status(404)
        .json({ message: "credentials missing please try again " });
    }

    if (
      typeof workspaceId !== "string" ||
      typeof folderId !== "string" ||
      typeof listId !== "string" ||
      typeof taskId !== "string"||
      typeof collabKey !=='string'
    ) {
      return res
        .status(404)
        .json({ message: "something went wrong please try after sometimes" });
    }
      const response = await this.searchService.getSearchCollaboratorInTask(
        workspaceId,
        folderId,
        listId,
        taskId,
        collabKey
      );
      if (!response) {
        return res.status(404).json({ message: "search item not found" });
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };


  
}

import { NextFunction, Request, Response } from "express";
import { IListService } from "../../Interfaces/IListService";
import { ListCollaboratorType } from "../../Entities/List";

export class ListController {
  private listService: IListService;
  constructor(listService: IListService) {
    this.listService = listService;
  }

  onCreateList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { workspaceId, folderId, listData } = req.body;
      if (!listData.list_title.trim() || !listData.list_description.trim()) {
        return res.status(404).json({ message: "full space invalid" });
      }

      let isDuplicateList = await this.listService.isListExist(
        workspaceId,
        folderId,
        listData.list_title
      );

      if (isDuplicateList) {
        return res.status(404).json({ message: "already exist" });
      }

      let createNewList = await this.listService.createList(
        workspaceId,
        folderId,
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
      let response = await this.listService.getallList(
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
      let response = await this.listService.getAllListPage(
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
      let listId = req.params.listId;
      let { folderId, workspaceId, priority } = req.body;

      if (!listId || !folderId || !workspaceId || !priority) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      let response = await this.listService.getUpdatePriority(
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
      let listId = req.params.listId;
      let { folderId, workspaceId, list_start_date, list_due_date } = req.body;

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
      let response = await this.listService.getUpdateListDate(
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
      let singleList = await this.listService.getSingleList(
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

  onAddNewMemberToList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {




    try {

      const { listId } = req.params;

      const { workspaceId, folderId, collabId } = req.body;
  
      if (!workspaceId || !folderId || !listId || !collabId) {
        return res.status(404).json({ message: "missing credential" });
      }
  
      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof collabId !== "string"
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }
     
      let isExist=await this.listService.getSingleList(workspaceId,
        folderId,
        listId)

        if (!isExist) {
          return res
            .status(400)
            .json({ message: "workspace not found please try again" });
        }

        const existingCollaborator = isExist.list_collaborators.find(
          (collab: ListCollaboratorType) => collab.assignee === collabId
        );

        if(existingCollaborator){
          return res.status(404).json({message:"already exist "})
        }

      let response = await this.listService.getAddCollabToList(
        workspaceId,
        folderId,
        listId,
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
  onGetCollabByList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
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

      let response = await this.listService.getListCollabByListId(
        workspaceId,
        folderId,
        listId
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

  onUpdateListCollabRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId, role } = req.body;

      const collabId = req.params.collabId;

      if (!workspaceId || !folderId || !listId || !collabId || !role) {
        return res.status(404).json({ message: "missing credential" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof collabId !== "string"
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }

      if (!["listManager", "spaceOwner", "viewer"].includes(role)) {
        return res.status(404).json({ message: "not found" });
      }

       if(role==='viewer'){
        let isEXIST=await this.listService.checkCollabIsExistInTasks(workspaceId,folderId,listId,collabId)
    
  if(isEXIST){
    return res.status(408).json({message :"cannot set role as viewer"})
  }
       }

  
    

      let response = await this.listService.getUpdateListCollabByListId(
        workspaceId,
        folderId,
        listId,
        collabId,
        role
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

  onDeleteCollabAssigneeFromList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId } = req.body;

      const collabId = req.params.collabId;

      if (!workspaceId || !folderId || !listId || !collabId) {
        return res.status(404).json({ message: "missing credential" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof collabId !== "string"
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }

      let response = await this.listService.getDeleteListCollabByListId(
        workspaceId,
        folderId,
        listId,
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

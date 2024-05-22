import { NextFunction, Request, Response } from "express";
import { IFolderService } from "../../Interfaces/IFolderService";
import { FolderDataType } from "../../Entities/Folder";

export class FolderController {
  private folderService: IFolderService;

  constructor(folderService: IFolderService) {
    this.folderService = folderService;
  }



  onCreateNewFolder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let spaceOwner = req.userId;
    const { folder_title, workspaceId } = req.body;

    try {
      let isFolderExist = await this.folderService.getDuplicateFolder(
        folder_title,
        workspaceId
      );
      if (isFolderExist) {
        return res.status(404).json({ message: "folder already exist" });
      }

      let isCreate = await this.folderService.createNewFolder(req.body);
      console.log(isCreate, "controller create folder");

      if (!isCreate) {
        return res.status(404).json({ message: "something went wrong" });
      }
      return res.status(200).json(isCreate);
    } catch (error) {
      next(error);
    }
  };

  onGetAllFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId: string = req.params.id;
      console.log(workspaceId, "hello");

      if (!workspaceId) {
        return res.status(404).json({ message: "something went wrong" });
      }
      let data = await this.folderService.getAllFolderByWorkSpaceId(
        workspaceId
      );
      console.log(data, "folder all");

      if (!data) {
        return res.status(404).json({ message: "not found" });
      }
      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  onGetFolderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { spaceId, folderId } = req.query;
      console.log(spaceId, folderId, "hey got it");

      if (!spaceId && !folderId) {
        return res.status(404).json({ message: "something went wrong" });
      }

      const getFolderById = await this.folderService.getFolderById(
        spaceId as string,
        folderId as string
      );
      if (!getFolderById) {
        return res.status(404).json({ message: "something went wrong" });
      }

      return res.status(200).json(getFolderById);
    } catch (error) {
      next(error);
    }
  };

  onUpadateFolder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { folderData, folderId } = req.body;

      console.log(folderData, folderId, "my folders");

      let spaceId = folderData.workspaceId;

      const isFolderExist = await this.folderService.getFolderById(
        spaceId,
        folderId
      );
      if (!isFolderExist) {
        return res.status(404).json({ message: "folder not found! try again" });
      }

      let data: Partial<FolderDataType> = {
        folder_title: folderData.folder_title,
        folder_description: folderData.folder_description,
        workspaceId: folderData.workspaceId,
      };
      const update = await this.folderService.updateFolder(data, folderId);

      if (!update) {
        return res
          .status(404)
          .json({ message: "error occurred please try again after some time" });
      }

      return res.status(200).json(update);
    } catch (error) {
      next(error);
    }
  };
}

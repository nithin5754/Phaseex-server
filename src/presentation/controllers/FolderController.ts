import { NextFunction, Request, Response } from "express";
import { IFolderService } from "../../Interfaces/IFolderService";

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

    try {
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
}

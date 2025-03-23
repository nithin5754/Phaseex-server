import { NextFunction, Request, Response } from "express";
import IAuthUserService from "../../interfaces/IAuthService";
import ISpaceService from "../../interfaces/ISpaceService";
import { CollaboratorType } from "../../Entities/WorkspaceDataType";

export class WorkSpaceController {
  private authService: IAuthUserService;
  private spaceService: ISpaceService;
  constructor(authService: IAuthUserService, spaceService: ISpaceService) {
    this.authService = authService;
    this.spaceService = spaceService;
  }

  onCreateNewSpace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.userId;
      const title: string = req.body.title.toLowerCase();

      const spaceData = { ...req.body, workspaceOwner: req.userId };

      if (!req.body) {
        return res
          .status(400)
          .json({ message: "something went wrong please try again!" });
      }

      if (!title.trim() || !req.body.workspace_description.trim()) {
        return res.status(404).json({ message: "full space invalid" });
      }

      let foundCreator = await this.authService.findUserById(userId);
      if (!foundCreator) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again later..." });
      }

      const isWorkSpaceExist = await this.spaceService.isTrueService(
        { title },
        "GET-SPACE-NAME"
      );

      if (isWorkSpaceExist) {
        return res.status(404).json({ message: "space already exist" });
      }

      const response = await this.spaceService.createSpace(spaceData);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  // type:'COMPLETED'|'HIDDEN'|'INVITED'|'OWNER'

  onGetAllOwnerSpaceLists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let spaceOwner = req.userId;

    try {
      const response = await this.spaceService.spaceListsService(
        spaceOwner,
        "OWNER"
      );
      return res.status(200).json(response ? response : []);
    } catch (error) {
      next(error);
    }
  };

  onGetAllHiddenSpaceLists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let spaceOwner = req.userId;

    try {
      const response = await this.spaceService.spaceListsService(
        spaceOwner,
        "HIDDEN"
      );
      return res.status(200).json(response ? response : []);
    } catch (error) {
      next(error);
    }
  };

  onGetAllInvitedSpaceLists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let spaceOwner = req.userId;

    try {
      const response = await this.spaceService.spaceListsService(
        spaceOwner,
        "INVITED"
      );
      return res.status(200).json(response ? response : []);
    } catch (error) {
      next(error);
    }
  };

  onChangeVisibility = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.body;
    try {
      let workspaceOwner = req.userId;

      const response = await this.spaceService.isTrueService(
        { id, workspaceOwner },
        "CHANGE-VISIBILITY"
      );
      if (!response) {
        return res.status(404).json({ message: "error in changing visiblity" });
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onDeleteWorkspace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const workspaceId = req.params.workspaceId;

      if (!workspaceId) {
        return res.status(404).json({ message: "not found" });
      }

      let isWorkspaceDeleted = await this.spaceService.isTrueService(
        { workspaceId },
        "DELETE-WORKSPACE"
      );

      if (!isWorkspaceDeleted) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again" });
      }

      return res.status(200).json(isWorkspaceDeleted);
    } catch (error) {
      next(error);
    }
  };

  onGetSingleWorkSpace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let workspaceOwner: string = req.userId;
      const workspaceId: string = req.params.id;

      if (!workspaceId) {
        return res.status(404).json({ message: "credentials missing" });
      }

      let isOwnerExist = await this.authService.findUserById(workspaceOwner);
      if (!isOwnerExist) {
        return res.status(404).json({ message: "user not found" });
      }

      let singleWorkSpace = await this.spaceService.singleSpaceDetails(
        workspaceId,
        "WORK-SPACE-ID"
      );
      if (!singleWorkSpace) {
        return res.status(404).json({ message: "workspace not found" });
      }
      let ownerSpaceName = await this.authService.findUserById(
        singleWorkSpace.workspaceOwner
      );

      return res.status(200).json({
        ...singleWorkSpace,
        ownerName: ownerSpaceName?.userName || isOwnerExist.userName,
      });
    } catch (error) {
      next(error);
    }
  };

  OnGetAllCollaboratorsInSpace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let workspaceId = req.params.workspaceId;
      if (!workspaceId || typeof workspaceId !== "string") {
        return res
          .status(404)
          .json({ message: "something went wrong credentials missing" });
      }

      let allCollabMembers = await this.spaceService.getAllCollaboratorInSpace(
        workspaceId
      );

      return res
        .status(200)
        .json(
          allCollabMembers && allCollabMembers.length > 0
            ? allCollabMembers
            : []
        );
    } catch (error) {
      next(error);
    }
  };

  onAddCollaboratorsToSpace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const workspaceId = req.body.workspaceId;
      const collaboratorId = req.body.collaboratorId;

      if (
        !workspaceId ||
        typeof workspaceId !== "string" ||
        !collaboratorId ||
        typeof collaboratorId !== "string"
      ) {
        return res
          .status(404)
          .json({ message: "something went wrong credentials missing" });
      }

      let isWorkSpaceExist = await this.spaceService.singleSpaceDetails(
        workspaceId,
        "WORK-SPACE-ID"
      );

      if (!isWorkSpaceExist) {
        return res
          .status(400)
          .json({ message: "workspace not found please try again" });
      }

      const existingCollaborator = isWorkSpaceExist.collaborators.find(
        (collab: CollaboratorType) => collab.assignee === collaboratorId
      );

      if (existingCollaborator) {
        return res
          .status(404)
          .json({ message: "user is already collaborating in this space" });
      }

      let addCollaborators = await this.spaceService.isTrueService(
        { workspaceId, collaboratorId },
        "ADD-COLLABORATORS"
      );

      if (!addCollaborators) {
        return res
          .status(400)
          .json({ message: "error in adding new  assignee to space" });
      }

      return res.status(200).json(addCollaborators);
    } catch (error) {
      next(error);
    }
  };

  onDeleteCollabrators = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, collaboratorId } = req.body;

      if (!workspaceId || !collaboratorId) {
        return res.status(404).json({ message: "credentials missing" });
      }

      const response = await this.spaceService.isTrueService(
        { workspaceId, collaboratorId },
        "DELETE-COLLABORATORS"
      );

      if (!response) {
        return res.status(404).json({ message: "something went wrong" });
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  onVerifyCollaborator = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, collaboratorId } = req.body;

      if (!workspaceId || !collaboratorId) {
        return res.status(404).json({ message: "credentials missing" });
      }

      let response = await this.spaceService.isTrueService(
        { workspaceId, collaboratorId },
        "VERIFY-COLLABORATORS"
      );

      if (!response) {
        return res
          .status(404)
          .json({ message: "error occur please try again later" });
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onUpdateSpaceRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, collaboratorId, role } = req.body;

      if (!workspaceId || !collaboratorId || !role) {
        return res.status(404).json({ message: "credentials missing" });
      }

      let isRoleUpdate = await this.spaceService.isTrueService(
        { workspaceId, collaboratorId, role },
        "UPDATE-COLLAB-ROLE"
      );

      if (!isRoleUpdate) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again later!" });
      }

      return res.status(200).json(isRoleUpdate);
    } catch (error) {
      next(error);
    }
  };
}

import { NextFunction, Request, Response } from "express";
import IAuthUserService from "../../Interfaces/IAuthService";
import ISpaceService from "../../Interfaces/ISpaceService";
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

      const isWorkSpaceExist = await this.spaceService.getWorkSpaceByName(
        title
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

  onGetAllWorkSpaceByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // const spaceOwner:string=req.body.spaceOwner

 

    let spaceOwner = req.userId;

    try {
      const response = await this.spaceService.getAllSpaceByUser(
        spaceOwner,
   
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onGoingWorkSpace = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let spaceOwner = req.userId;

    try {
      const responsePromise = await this.spaceService.getAllOnGoingSpace(
        spaceOwner
      );
      const invitesSpacePromise = await this.spaceService.getAllInvitedSpace(
        spaceOwner,
        true
      );

      
      const [response, invitesSpace] = await Promise.all([
        responsePromise,
        invitesSpacePromise,
      ]);
      
      if (!response && !invitesSpace) {
        return res.status(404).json({ message: "Response not found" });
      }
      
      console.log(invitesSpace,"is invite space available")
      const mergedArray = [];
      if (response) {
        mergedArray.push(...response);
      }
      if (invitesSpace) {
        mergedArray.push(...invitesSpace);
      }

      return res.status(200).json(mergedArray);
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

      const response = await this.spaceService.changeVisible(
        id,
        workspaceOwner
      );
      if (!response) {
        return res.status(404).json({ message: "error in changing visiblity" });
      }
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onInActiveCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let workspaceOwner: string = req.userId;
      let allCount = await this.spaceService.getCountInActive(workspaceOwner);
      if (!allCount) {
        return res.status(404).json({ message: "something went wrong" });
      }

      return res.status(200).json({ count: allCount });
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

      let singleWorkSpace = await this.spaceService.getSingleWorkSpace(
        workspaceId
      );
      if (!singleWorkSpace) {
        return res.status(404).json({ message: "workspace not found" });
      }

      return res.status(200).json(singleWorkSpace);
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

      console.log(workspaceId, collaboratorId, "add collab ids");

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

      let isWorkSpaceExist = await this.spaceService.getSingleWorkSpace(
        workspaceId
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
          .json({ message: "user is already collbrating in this space" });
      }

      let addCollaborators = await this.spaceService.getAddCollaboratorsToSpace(
        workspaceId,
        collaboratorId
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



      if (!allCollabMembers || allCollabMembers.length < 0) {
        return res.status(404).json({ message: "not found" });
      }

      return res.status(200).json(allCollabMembers);
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

      const response = await this.spaceService.getDeleteCollaboratorsToSpace(
        workspaceId,
        collaboratorId
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

      let response = await this.spaceService.getUpdateCollaboratorsVerified(
        workspaceId,
        collaboratorId
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

      let isWorkspaceDeleted = await this.spaceService.getDeleteWorkspace(
        workspaceId
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



onUpdateSpaceRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { workspaceId, collaboratorId,role } = req.body;

    console.log(req.body,"update collab ")

    if (!workspaceId || !collaboratorId||!role) {
      return res.status(404).json({ message: "credentials missing" });
    }

    let isRoleUpdate=await this.spaceService.getUpdateCollaboratorsRole(workspaceId,collaboratorId,role)

    if(!isRoleUpdate){
      return res.status(404).json({message:"something went wrong please try again later!"})
    }

    return res.status(200).json(isRoleUpdate)

    
  } catch (error) {
    next(error)
  }
}

}

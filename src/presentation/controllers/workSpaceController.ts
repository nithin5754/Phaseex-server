import { NextFunction, Request, Response } from "express";
import IAuthUserService from "../../Interfaces/IAuthService";
import ISpaceService from "../../Interfaces/ISpaceService";

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
    // const {creator_id,workSpace_name,workspace_description,workspace_type}=req.body

    //  let foundCreator=await this.authService.findUserById(creator_id)
    //  if(!foundCreator){
    //  return res.status(404).json({message:"something went wrong please try again later..."})
    //  }

    const spaceData = { ...req.body, workspaceOwner: req.userId };

    const response = await this.spaceService.createSpace(spaceData);



    return res.status(200).json(response);
  };

  onGetAllWorkSpaceByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // const spaceOwner:string=req.body.spaceOwner

    const { pageId = 1 } = req.query;
    let limit=6

    let spaceOwner = req.userId;

    try {
      const response = await this.spaceService.getAllSpaceByUser(spaceOwner,Number(pageId),limit);
   
      if (!response) {
        return res.status(404).json({ message: "response not found" });
      }
      
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
      const response = await this.spaceService.getAllOnGoingSpace(spaceOwner);
      if (!response) {
        return res.status(404).json({ message: "response not found" });
      }
      return res.status(200).json(response);
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

    
    
        const response = await this.spaceService.changeVisible(id, workspaceOwner);
        if (!response) {
          return res.status(404).json({ message: "error in changing visiblity" });
        }
        return res.status(200).json(response);
      } catch (error) {
        next(error)
      }
  };

  onInActiveCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let workspaceOwner:string=req.userId
      let allCount=await this.spaceService.getCountInActive(workspaceOwner)    
      if(!allCount){

        return res.status(404).json({ message: "something went wrong" });
      }
      
      return res.status(200).json({count:allCount});
    } catch (error) {
      next(error)
    }
  }
}

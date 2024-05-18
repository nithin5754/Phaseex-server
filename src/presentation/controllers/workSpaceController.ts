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

    const response = await this.spaceService.createSpace(req.body);

    console.log(response, "space,controller");

    return res.status(200).json(response);
  };


  onGetAllWorkSpaceByUser= async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
       
    // const spaceOwner:string=req.body.spaceOwner

    let spaceOwner=req.userId
    console.log(spaceOwner,"hello");
    


    try {
      const response=await this.spaceService.getAllSpaceByUser(spaceOwner)
      if(!response){
        return res.status(404).json({message:"response not found"});
      }
   return res.status(200).json(response);
    } catch (error) {
      next(error)
    }

  }
}


import { NextFunction, Request, Response } from "express";
import { IVideoService } from "../../Interfaces/IVideoService";




 export class CallController {
  private videoService:IVideoService
  constructor(videoService:IVideoService) {

    this.videoService=videoService    
  }




onGetVideoChatNotification = async (req: Request, res: Response, next: NextFunction) => {

  const {workspaceId}=req.params

  if(!workspaceId|| typeof workspaceId !== 'string'){
    return res.status(404).json({message:"credentials missing please try again after some time"})
  }

 let getAllNoti=await this.videoService.AllVNoti(workspaceId)

 if(!getAllNoti){
return res.status(404).json({message:"something went wrong"})
 }

 return res.status(200).json(getAllNoti)



 }

}
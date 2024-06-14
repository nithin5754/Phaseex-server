import { NextFunction, Request, Response } from "express";
import { INotificationService } from "../../Interfaces/INotificationService";





export class NotificationController {
  private notificationService:INotificationService
  constructor(notificationService:INotificationService) {
    this.notificationService=notificationService

    
  }


  onGetAllNotification = async (req: Request, res: Response, next: NextFunction) => {


    const { userId } = req.body;

       try {
        if(!userId){
          return res.status(404).json({message:"credentials missing"})
        }
    
        let response=await this.notificationService.getAllNotification(userId)


        if (response.total===0) {
          return res.status(400).json({ message: 'No notifications found' });
        }
    
        return res.status(200).json(response)
       } catch (error) {
          next(error)
       }

  }


  onGetAllNotificationUnRead = async (req: Request, res: Response, next: NextFunction) => {




const userId=req.userId

       try {
        if(!userId){
          return res.status(404).json({message:"credentials missing"})
        }
    
        let response=await this.notificationService.getAllNotificationUnReadOnly(userId)


        if (response.length<0) {
          return res.status(400).json({ message: 'No notifications found' });
        }

    
        return res.status(200).json(response)
       } catch (error) {
          next(error)
       }

  }
}
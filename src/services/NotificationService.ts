
import { response } from "express";
import { NotificationType } from "../Entities/notification";
import { INotificationRepository } from "../interfaces/INotificationRepository";
import { INotificationService, NotifTotalType } from "../interfaces/INotificationService";




export class NotoficationService implements INotificationService {
  private notificationRepo:INotificationRepository
  constructor(notificationRepo:INotificationRepository) {
    this.notificationRepo=notificationRepo
  }
  async getDeleteInviteLinkNoti(notificationId: string): Promise<boolean> {
    let response=await this.notificationRepo.deleteInviteLinkNoti(notificationId)
   return response
  }
  async getDeleteNotification(notificationId: string): Promise<boolean> {
   let response=await this.notificationRepo.deleteNotification(notificationId)
   return response
  }
  async getUpdateReadNotification(notificationId: string): Promise<boolean> {
  let response=await this.notificationRepo.updateReadNotification(notificationId)
  return response
  }
 async getAllNotificationUnReadOnly(userId: string): Promise<NotificationType[]|[]> {
    let response=await this.notificationRepo.allNotificationUnRead(userId)

    if(!response){
      return []
    }

    return response
  }
  async getCreateNotification(userId: string, notificationData: Partial<NotificationType>): Promise<boolean> {
   let response=await this.notificationRepo.createNotification(userId,notificationData)
   return response
  }
 async getAllNotificationUnReadLength(userId: string): Promise<number> {
    let total:number=await this.notificationRepo.allNotificationUnReadLength(userId)

    return total
  }
  async getAllNotificationUnRead(userId: string): Promise<NotifTotalType> {
    let response=await this.notificationRepo.allNotificationUnRead(userId)
 
    let total:number=await this.notificationRepo.totalNotification(userId)

       
      let  notificationData:NotifTotalType={
        notificationList:response&&response.length>0?response:[],
        total:total
      }


      return notificationData


       
    
  }
  async getAllNotification(userId: string): Promise<NotificationType[]|[]> {
    let response=await this.notificationRepo.allNotification(userId)

    if(!response){
      return []
    }

    return response

     

  }


}

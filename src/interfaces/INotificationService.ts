import { NotificationType } from "../Entities/notification";

 

export interface NotifTotalType {
  notificationList:NotificationType[],
  total:number
}
   

export interface INotificationService {

  getAllNotification(userId:string):Promise<NotifTotalType>
  getAllNotificationUnRead(userId:string):Promise<NotifTotalType>
  getAllNotificationUnReadOnly(userId:string):Promise<NotificationType[]|[]>
  getAllNotificationUnReadLength(userId:string):Promise<number>
  getCreateNotification(userId:string,notificationData:Partial<NotificationType>):Promise<boolean>
  
  
}
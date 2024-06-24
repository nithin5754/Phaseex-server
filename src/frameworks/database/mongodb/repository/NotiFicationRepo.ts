import { INotificationRepository } from "../../../../Interfaces/INotificationRepository";
import { Notification as NotificationModal } from "../models/Notification";
import { NotificationType } from "../../../../Entities/notification";
import moment from "moment";

export class NotificationRepository implements INotificationRepository {
  constructor() {}
  async deleteInviteLinkNoti(notificationId: string): Promise<boolean> {
    let response=await NotificationModal.findOneAndUpdate({_id:notificationId},{link:" "},{ new: true })
console.log(response,"invite link-delete");

    return !!response
  }
  async deleteNotification(notificationId: string): Promise<boolean> {
    let response=await NotificationModal.findByIdAndDelete(notificationId)

    return !!response
  }
  async updateReadNotification(notificationId: string): Promise<boolean> {
   let response=await NotificationModal.findByIdAndUpdate(notificationId,{read:true},{ new: true })

   return !!response
  }
 async createNotification(userId: string, notificationData: Partial<NotificationType>): Promise<boolean> {
  let response=  await NotificationModal.create({...notificationData})

  
  return !!response
  }
 async allNotificationUnReadLength(userId: string): Promise<number> {
  const response = await NotificationModal.countDocuments({ownerId:userId,read:false });
    return response
  }
 async allNotificationUnRead(userId: string):Promise<NotificationType[] | null> {
    const response = await NotificationModal.find({ownerId:userId,read:false }).sort({createdAt:-1});

    if (response && response.length > 0) {
      let responseData:NotificationType[] = response.map((notification) => {
        return {
          id: notification._id.toString() as string,
          ownerId: notification.ownerId?.toString() as string,
          senderId: notification.senderId?.toString() as string,
          link: notification.link?notification.link:'',
          priority: notification.priority? notification.priority : '',
          messageSendBy:notification.messageSendBy?notification.messageSendBy:' ',
          Description:notification.Description?notification.Description:' ',
          workspaceName:notification.workspaceName?notification.workspaceName:'',
          messageReceiver:notification.messageReceiver?notification.messageReceiver:'',
          title: notification.title?notification.title:'',
          type: notification.type?notification.type:'',
          read: notification.read?notification.read:false,
          createdAt: moment(notification.createdAt).format("MMMM D, YYYY - h:mm A"),
          updatedAt: moment(notification.updatedAt).format("MMMM D, YYYY - h:mm A"),
        };
      });
  
      return responseData;
    }

    return null;
  }
  async totalNotification(userId: string): 
  
  Promise<number> {
    const total = await NotificationModal.countDocuments({userId});
    return total
  }

  async allNotification(userId: string): Promise<NotificationType[] | null> {
    const response = await NotificationModal.find({ownerId:userId,read:true }).sort({createdAt:-1});

    if (response && response.length > 0) {
      let responseData:NotificationType[] = response.map((notification) => {
        return {
          id: notification._id.toString() as string,
          ownerId: notification.ownerId?.toString() as string,
          senderId: notification.senderId?.toString() as string,
          link: notification.link?notification.link:'',
          priority: notification.priority? notification.priority : '',
          messageSendBy:notification.messageSendBy?notification.messageSendBy:' ',
          Description:notification.Description?notification.Description:' ',
          workspaceName:notification.workspaceName?notification.workspaceName:'',
          messageReceiver:notification.messageReceiver?notification.messageReceiver:'',
          title: notification.title?notification.title:'',
          type: notification.type?notification.type:'',
          read: notification.read?notification.read:false,
          createdAt: moment(notification.createdAt).format("MMMM D, YYYY - h:mm A"),
          updatedAt: moment(notification.updatedAt).format("MMMM D, YYYY - h:mm A"),
        };
      });
  
      return responseData;
    }

    return null;
  }
}

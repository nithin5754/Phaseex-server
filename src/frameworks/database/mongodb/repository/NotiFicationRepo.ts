import { INotificationRepository } from "../../../../Interfaces/INotificationRepository";
import { Notification as NotificationModal } from "../models/Notification";
import { NotificationType } from "../../../../Entities/notification";
import moment from "moment";

export class NotificationRepository implements INotificationRepository {
  constructor() {}
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
console.log("heyuuuhfghsdgfsdhf");

    if (response && response.length > 0) {
      let responseData:NotificationType[] = response.map((notification) => {
        return {
          id: notification._id.toString() as string,
          ownerId: notification.ownerId?.toString() as string,
          senderId: notification.senderId?.toString() as string,
          link: notification.link?notification.link:'',
          priority: notification.priority? notification.priority : '',
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
    const response = await NotificationModal.find({ownerId: userId });

  

    if (response && response.length > 0) {
      let responseData:NotificationType[] = response.map((notification) => {
        return {
          id: notification._id.toString() as string,
          ownerId: notification.ownerId?.toString() as string,
          senderId: notification.senderId?.toString() as string,
          link: notification.link?notification.link:'',
          priority: notification.priority? notification.priority : '',
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

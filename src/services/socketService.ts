
import { Socket } from "socket.io";
import IAuthRepository from "../Interfaces/IAuthRepository";
import { INotificationService } from "../Interfaces/INotificationService";

type OnlineUserType = {
  userId: string;
  socketId: string;
};


export class SocketService {
  private UserRepository:IAuthRepository
  private NotificationService:INotificationService
  private onlineUser:OnlineUserType[]=[]


  constructor(UserRepository:IAuthRepository,NotificationService:INotificationService) {
  this.UserRepository=UserRepository
  this.NotificationService=NotificationService
  }


  private  addNewUser (userId: string, socketId: string): void {
    if (!this.onlineUser.some((user) => user.userId === userId)) {
      this.onlineUser.push({ userId, socketId });
    }

    console.log(this.onlineUser,"hello online");
    
  };

  private removeUser(socketId: string):void {
      this.onlineUser = this.onlineUser.filter((user) => user.socketId !== socketId);
    };


    private getUser(userId: string):OnlineUserType|null{
        let response= this.onlineUser.find((user) => user.userId === userId);
        if(response){
          return response
        }
        return null
      };
    

  handleConnection(socket: Socket): void {
    socket.on("disconnect", () => {
      this.removeUser(socket.id)
      console.log("user disconnected");
      
    });

    socket.on("newUser", async (userId:string) => {
      console.log("newUser");
      
      try {
       if(userId){
        const oneUser = await this.UserRepository.findById(userId)
        if (oneUser) {
           this.addNewUser(userId,socket.id)
           console.log(this.onlineUser,"online user")
          console.log(`⚡ Socket: User with id ${userId} connected`);
        } else {
          console.log(`🚩 Socket: No user with id ${userId}`);
        }

       }
      } catch (error) {
        console.log("socket error newuser", error);
      }
    });


    



    socket.on('getNotificationsLength', async (userId) => {
      const notificationsLength = await this.NotificationService.getAllNotificationUnReadLength(userId)
      
            const receiver=this.getUser(userId)    
if(receiver){
  socket.to(receiver.socketId).emit("getNotification",notificationsLength)
}
    });


    socket.on('sendNotification',async({
      senderName,
      receiverName,
      name,
      type,
      message,
      
    })=>{
      
 const receiver=this.getUser(receiverName)   

 let notificationData={
  ownerId:receiverName,
  senderId:senderName,
  link:"wwww",
  title:message,
  type:type,
  read:false,

 } 
  
 if(!receiver){


    //  await this.NotificationService.getCreateNotification(receiverName,notificationData)
    console.log("offline")
     
 }
 
if(receiver){
  await this.NotificationService.getCreateNotification(receiverName,notificationData) 


  
  socket.to(receiver.socketId).emit("getNotification",notificationData)
  socket.to(receiver.socketId).emit("getNotificationUnReadLength",1)
  
}
    })





  }
}

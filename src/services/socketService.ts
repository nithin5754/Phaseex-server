
import { Socket } from "socket.io";
import IAuthRepository from "../interfaces/IAuthRepository";
import { INotificationService } from "../interfaces/INotificationService";
import { IVideoService } from "../interfaces/IVideoService";
import { TVideoInviteLink } from "../Entities/callInvites";
import { IMailer } from "../interfaces/IMailer";

type OnlineUserType = {
  userId: string;
  socketId: string;
};


export class SocketService {
  private UserRepository:IAuthRepository
  private NotificationService:INotificationService
  private VideoNotiService:IVideoService
  private mailer:IMailer

  private onlineUser:OnlineUserType[]=[]


  constructor(UserRepository:IAuthRepository,NotificationService:INotificationService,VideoNotiService:IVideoService,mailer:IMailer) {
  this.UserRepository=UserRepository
  this.NotificationService=NotificationService
  this.VideoNotiService=VideoNotiService
  this.mailer=mailer
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
      messageSendBy,
      link,
      messageReceiver,
      workspaceName,
      Description,
      type,
      message,
      
    })=>{
      
 const receiver=this.getUser(receiverName)   

 let notificationData={
  ownerId:receiverName,
  senderId:senderName,
  link,
  Description,
  messageReceiver,
  workspaceName,
  title:message,
  messageSendBy,
  type:type,
  read:false,

 } 
  
 if(!receiver){
  await this.NotificationService.getCreateNotification(receiverName,notificationData) 
     
 }
 
if(receiver){

  await this.NotificationService.getCreateNotification(receiverName,notificationData) 
  socket.to(receiver.socketId).emit("getNotification",notificationData)
  socket.to(receiver.socketId).emit("getNotificationUnReadLength",1)
  
}
    });




    socket.on('SendInviteVideoCall',async({
      senderId,
      ownerName,
      receiverArray,
      workspaceId,
      type,
      url,

      
    })=>{
      
        if(receiverArray&&receiverArray.length>0){

          console.log(receiverArray,"array og recevier");
          receiverArray.map(async (user:any)=>{
            const receiver=this.getUser(user.id)   
            const isUser=await this.UserRepository.findById(user.id)

         
       
      
            let VNotificationSend={
              senderId,
              ownerName,
              workspaceId,
              url,
              type,
       
            }


           await  this.VideoNotiService.getCreate(VNotificationSend)
            
            if(receiver){
              
             socket.to(receiver.socketId).emit("getInviteVideoCall",VNotificationSend)
             socket.to(receiver.socketId).emit("getInviteVideoCallIndicator",{workspaceId,count:1})
           
             
           }
           if(isUser&&isUser.email){
            await this.mailer.SendVideoCallInvite(ownerName,isUser?.email,url)
          }
         
          })
         
        }
    })




    





  }
}

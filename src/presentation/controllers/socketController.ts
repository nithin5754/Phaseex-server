
// import { Server, Socket } from "socket.io";


// type OnlineUserType = {
//   userId: string;
//   socketId: string;
// };

// let onlineUser: OnlineUserType[] = [];
// console.log(onlineUser,"online user");


// const addNewUser = (userId: string, socketId: string): void => {
//   if (!onlineUser.some((user) => user.userId === userId)) {
//     onlineUser.push({ userId, socketId });
//   }
// };


// const removeUser=(socketId:string)=>{
//   onlineUser=onlineUser.filter((user)=>user.socketId!==socketId)
// }

// const getUser=(userId:string)=>{
//   return onlineUser.find((user)=>user.userId===userId)
// }




// export const socketManage = (io:Server) => {

//   io.on('connection', (socket:Socket) => {
//     console.log('New client connected');
//     socket.on('newUser',(userId:string)=>{
//       addNewUser(userId,socket.id)
//       console.log(onlineUser,"inside get user");
//     });

//     socket.on('sendNotification',({
//       senderName,
//       receiverName,
//       name,
//       message,
      
//     })=>{
      
//       const receiver=getUser(receiverName)    
// if(receiver){
//   io.to(receiver.socketId).emit("getNotification",message)
// }
//     })



   
   


//     socket.on("disconnect",()=>{
     
//       removeUser(socket.id)
//     })
//   });
  
   
// }
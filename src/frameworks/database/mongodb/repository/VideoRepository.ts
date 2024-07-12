import moment from "moment";
import { TVideoInviteLink } from "../../../../Entities/callInvites";
import { IVideoRepository } from "../../../../Interfaces/IVedioRepository";

import { CallNotification as VCNotification } from "../models/VideoNotificationModal";
   

   export class VideoRepository implements IVideoRepository { 
    constructor() {
      
    }
     async delete(workspaceId: string): Promise<boolean> {
        let response=await VCNotification.deleteMany({workspaceId})  

        return !!response
           
      }
     async getVNoti(workspaceId: string): Promise<TVideoInviteLink|null> {
          let response=await VCNotification.findOne({workspaceId})

          if(response){
            let responseData:TVideoInviteLink={
               id: response._id.toString() as string,
               senderId: response?.senderId?.toString() as string,
               workspaceId:response?.workspaceId?.toString() as string,
               ownerName:response?.ownerName as string,
               url:response?.url as string,
               type: "video",
               createdAt: moment(response.createdAt).format("MMMM D, YYYY - h:mm A"),
            }
            return responseData
          }

          return null
      }
     async create(data: Partial<TVideoInviteLink>):Promise<boolean> {

      let response=await VCNotification.create(data)

      return !!response
        

      }


    

   }
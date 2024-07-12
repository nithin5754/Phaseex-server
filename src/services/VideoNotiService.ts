import { TVideoInviteLink } from "../Entities/callInvites";
import { IVideoRepository } from "../Interfaces/IVedioRepository";
import { IVideoService } from "../Interfaces/IVideoService";



export class VideoNotiService implements IVideoService {
  private VideoRepo:IVideoRepository
  constructor(VideoRepo:IVideoRepository) {
    this.VideoRepo=VideoRepo
    
  }
  AllVNoti(workspaceId: string): Promise<TVideoInviteLink | null> {
   return this.VideoRepo.getVNoti(workspaceId)
  }
 async getCreate(data: Partial<TVideoInviteLink>): Promise<boolean> {

     if(data&&data.workspaceId){
    await this.VideoRepo.delete(data.workspaceId)

     }
    
    return  this.VideoRepo.create(data)
  }
}
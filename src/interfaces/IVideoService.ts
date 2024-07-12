import { TVideoInviteLink } from "../Entities/callInvites";




export interface IVideoService  {

  getCreate(data:Partial<TVideoInviteLink>):Promise<boolean>
  AllVNoti(workspaceId:string):Promise<TVideoInviteLink|null>
}
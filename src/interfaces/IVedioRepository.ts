import { TVideoInviteLink } from "../Entities/callInvites";



export interface IVideoRepository {
   
    create(data:Partial<TVideoInviteLink>):Promise<boolean>

    getVNoti(workspaceId:string):Promise<TVideoInviteLink|null>

    delete(workspaceId:string):Promise<boolean>
}
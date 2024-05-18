import { WorkspaceDataType } from "../Entities/WorkspaceDataType";



interface ISpaceService{
    createSpace(data:Partial<WorkspaceDataType>):Promise<WorkspaceDataType>

    getAllSpaceByUser(workspaceOwner:string): Promise<WorkspaceDataType[] | null>
    
}


export default ISpaceService
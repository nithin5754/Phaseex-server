


import { WorkspaceDataType } from "../Entities/WorkspaceDataType";

 interface ISpaceRepository {

  create(workspaceData:Partial<WorkspaceDataType>):Promise<WorkspaceDataType> 
  findByName(workspace_name:string):Promise<WorkspaceDataType|null>
  findAllByUser(workspaceOwner:string): Promise<WorkspaceDataType[] | null>
}



export default ISpaceRepository;
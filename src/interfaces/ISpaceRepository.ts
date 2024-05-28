


import { WorkspaceDataType } from "../Entities/WorkspaceDataType";

 interface ISpaceRepository {

  create(workspaceData:Partial<WorkspaceDataType>):Promise<WorkspaceDataType>; 
  findByName(workspace_name:string):Promise<WorkspaceDataType|null>;
  findAllByUser(workspaceOwner:string,pageId:number,limit:number): Promise<WorkspaceDataType[] | null>;
  findAllByUserLength(workspaceOwner:string):Promise<number>;
  findAllOnGoing(workspaceOwner:string): Promise<WorkspaceDataType[] | null>;
  changeVisibility(id:string,workspaceOwner: string): Promise<boolean>;
  findSingleWorkSpace(workspace_id:string):Promise<WorkspaceDataType|null>;
  findWorkSpaceByName(title:string):Promise<boolean>;

  

}



export default ISpaceRepository;
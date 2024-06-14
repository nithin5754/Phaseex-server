import { CollaboratorType, WorkspaceDataType, workspaceSpaceJwtType } from "../Entities/WorkspaceDataType";




interface ISpaceService {
  createSpace(data: Partial<WorkspaceDataType>): Promise<WorkspaceDataType>;

  getAllSpaceByUser(
    workspaceOwner: string,
    pageId: number,
    limit: number
  ): Promise<WorkspaceDataType[] | null>;

  getAllOnGoingSpace(
    workspaceOwner: string
  ): Promise<WorkspaceDataType[] | null>;
  changeVisible(id: string, workspaceOwner: string): Promise<boolean>;

  getCountInActive(workspaceOwner: string): Promise<number>;

  getSingleWorkSpace(workspace_id: string): Promise<WorkspaceDataType | null>;
  getWorkSpaceByName(title: string): Promise<boolean>;
  getAllSpaceByOwner(workspaceOwner:string):Promise<workspaceSpaceJwtType[]|null>
  getAddCollaboratorsToSpace(workspaceId:string,collaboratorId:string):Promise<boolean>
  getAllCollaboratorInSpace(workspaceId:string):Promise<CollaboratorType[]|null>
  getDeleteCollaboratorsToSpace(workspaceId:string,collaboratorId:string):Promise<boolean>
  getUpdateCollaboratorsVerified(workspaceId:string,collaboratorId:string):Promise<boolean>


 
}

export default ISpaceService;

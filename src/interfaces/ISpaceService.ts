import {
  WorkspaceDataType,
  workspaceSpaceJwtType,
} from "../Entities/WorkspaceDataType";

interface ISpaceService {
  createSpace(data: Partial<WorkspaceDataType>): Promise<WorkspaceDataType>;
  getWorkSpaceByName(title: string): Promise<boolean>;
  getAllSpaceByOwner(
    workspaceOwner: string
  ): Promise<workspaceSpaceJwtType[] | null>;
  spaceListsService(
    workspaceOwner: string,
    type: "COMPLETED" | "HIDDEN" | "INVITED" | "OWNER"
  ): Promise<WorkspaceDataType[] | null>;
  changeVisible(id: string, workspaceOwner: string): Promise<boolean>;
  getDeleteWorkspace(workspaceId: string): Promise<boolean>;
  singleSpaceDetails(
    workspace_id: string,
    type: "WORK-SPACE-ID"
  ): Promise<WorkspaceDataType | null>;
}

export default ISpaceService;

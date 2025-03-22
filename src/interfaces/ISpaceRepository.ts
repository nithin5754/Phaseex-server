// `/invite?workspace=${getSingleWorkSpace.id}&username=${userId}&notificationId=12345&senderId`;

import { WorkspaceDataType } from "../Entities/WorkspaceDataType";

interface ISpaceRepository {
  create(workspaceData: Partial<WorkspaceDataType>): Promise<WorkspaceDataType>;
  findWorkSpaceByName(title: string): Promise<boolean>;
  findAllSpaceByOwner(
    workspaceOwner: string
  ): Promise<WorkspaceDataType[] | null>;

  getHiddenSpaceByOwnerLists(
    workspaceOwner: string
  ): Promise<WorkspaceDataType[] | null>;

  getLiveSpaceByOwnerLists(
    workspaceOwner: string
  ): Promise<WorkspaceDataType[] | null>;

  getInvitesSpaceLists(
    workspaceOwner: string
  ): Promise<WorkspaceDataType[] | null>;

  changeVisibility(id: string, workspaceOwner: string): Promise<boolean>;
  deleteWorkspace(workspaceId: string): Promise<boolean>;
  findSpaceById(workspace_id: string): Promise<WorkspaceDataType | null>;
}

export default ISpaceRepository;

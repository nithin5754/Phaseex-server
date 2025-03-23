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

  //user schema
  findByIdForName(id: string): Promise<string | null>;
  //collab members lists

  allCollaboratorInSpace(
    workspaceId: string
  ): Promise<WorkspaceDataType | null>;

  addCollaboratorsToSpace(
    workspaceId: string,
    collaboratorId: string
  ): Promise<boolean>;

  deleteCollaboratorsToSpace(
    workspaceId: string,
    collaboratorId: string
  ): Promise<boolean>;

  updateCollaboratorsVerified(workspaceId: string, collaboratorId: string): Promise<boolean>

  updateCollaboratorsRole(workspaceId: string, collaboratorId: string, role: string): Promise<boolean>
}

export default ISpaceRepository;

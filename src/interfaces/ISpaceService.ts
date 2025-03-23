import {
  getCollaboratorType,
  WorkspaceDataType,
  workspaceSpaceJwtType,
} from "../Entities/WorkspaceDataType";
import { IisTrueService } from "../services/spaceService";

interface ISpaceService {
  createSpace(data: Partial<WorkspaceDataType>): Promise<WorkspaceDataType>;

  getAllSpaceByOwner(
    workspaceOwner: string
  ): Promise<workspaceSpaceJwtType[] | null>;
  spaceListsService(
    workspaceOwner: string,
    type: "COMPLETED" | "HIDDEN" | "INVITED" | "OWNER"
  ): Promise<WorkspaceDataType[] | null>;
  singleSpaceDetails(
    workspace_id: string,
    type: "WORK-SPACE-ID"
  ): Promise<WorkspaceDataType | null>;

  getAllCollaboratorInSpace(
    workspaceId: string
  ): Promise<getCollaboratorType[] | null>;

  isTrueService(
    data: IisTrueService,
    type:
      | "DELETE-WORKSPACE"
      | "CHANGE-VISIBILITY"
      | "DELETE-COLLABORATORS"
      | "ADD-COLLABORATORS"
      | "GET-SPACE-NAME"
      | "VERIFY-COLLABORATORS"
      | "UPDATE-COLLAB-ROLE"
  ): Promise<boolean>;
}

export default ISpaceService;

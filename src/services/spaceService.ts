import {
  CollaboratorType,
  WorkspaceDataType,
  getCollaboratorType,
  workspaceSpaceJwtType,
} from "../Entities/WorkspaceDataType";
import { IFolderRepository } from "../interfaces/IFolderRepository";
import { IListRepository } from "../interfaces/IListRepository";

import ISpaceRepository from "../interfaces/ISpaceRepository";
import ISpaceService from "../interfaces/ISpaceService";
import { ITaskRepository } from "../interfaces/ITaskRepository";
import { ITodoRepository } from "../interfaces/ITodoRepository";
import { Role } from "../presentation/utils/rolesPermission";

export interface IisTrueService {
  workspaceId?: string;
  id?: string;
  workspaceOwner?: string;
  collaboratorId?: string;
  title?: string;
  role?: Role;
}

export class SpaceService implements ISpaceService {
  private spaceRepository: ISpaceRepository;
  private folderRepository: IFolderRepository;
  private listRepository: IListRepository;
  private taskRepository: ITaskRepository;
  private todoRepository: ITodoRepository;

  constructor(
    spaceRepository: ISpaceRepository,
    folderRepository: IFolderRepository,
    listRepository: IListRepository,
    taskRepository: ITaskRepository,
    todoRepository: ITodoRepository
  ) {
    this.spaceRepository = spaceRepository;
    this.folderRepository = folderRepository;
    this.listRepository = listRepository;
    this.taskRepository = taskRepository;
    this.todoRepository = todoRepository;
  }

  async createSpace(
    data: Partial<WorkspaceDataType>
  ): Promise<WorkspaceDataType> {
    return this.spaceRepository.create(data);
  }

  async getAllSpaceByOwner(
    workspaceOwner: string
  ): Promise<workspaceSpaceJwtType[] | null> {
    let response = await this.spaceRepository.findAllSpaceByOwner(
      workspaceOwner
    );

    if (response && response.length > 0) {
      let responseData: workspaceSpaceJwtType[] = response.map((workspace) => ({
        id: workspace.id,
        role: "owner",
      }));
      return responseData;
    }
    return null;
  }

  async spaceListsService(
    workspaceOwner: string,
    type: "COMPLETED" | "HIDDEN" | "INVITED" | "OWNER"
  ): Promise<WorkspaceDataType[] | null> {
    let response: WorkspaceDataType[] | null = null;
    switch (type) {
      case "COMPLETED":
        response = [];
        break;
      case "HIDDEN":
        response = await this.spaceRepository.getHiddenSpaceByOwnerLists(
          workspaceOwner
        );
        break;
      case "INVITED":
        response = await this.spaceRepository.getInvitesSpaceLists(
          workspaceOwner
        );
        break;
      case "OWNER":
        response = await this.spaceRepository.getLiveSpaceByOwnerLists(
          workspaceOwner
        );
        break;
    }

    return response;
  }

  async singleSpaceDetails(
    workspace_id: string,
    type: "WORK-SPACE-ID"
  ): Promise<WorkspaceDataType | null> {
    switch (type) {
      case "WORK-SPACE-ID":
        let response = await this.spaceRepository.findSpaceById(workspace_id);
        if (response) {
          return response;
        }

        break;
    }
    return null;
  }

  async getAllCollaboratorInSpace(
    workspaceId: string
  ): Promise<getCollaboratorType[] | null> {
    let response = await this.spaceRepository.allCollaboratorInSpace(
      workspaceId
    );
    if (response) {
      const collaboratorsPromises: any = response.collaborators.map(
        async (collaborator: CollaboratorType) => {
          const assigneeDetail = await this.spaceRepository.findByIdForName(
            collaborator.assignee
          );
          return {
            assignee: assigneeDetail,
            role: collaborator.role,
            id: collaborator.assignee,
            verified: collaborator.verified,
          };
        }
      );

      const ownerName: string | null =
        await this.spaceRepository.findByIdForName(response.workspaceOwner);

      let collaborators: getCollaboratorType[] = await Promise.all(
        collaboratorsPromises
      );
      if (ownerName) {
        collaborators = [
          ...collaborators,
          {
            assignee: ownerName,
            role: "owner",
            id: response.workspaceOwner,
            verified: true,
          },
        ];
      }

      if (collaborators && collaborators.length > 0) {
        return collaborators;
      }
    }
    return null;
  }

  async isTrueService(
    data: IisTrueService,
    type:
      | "DELETE-WORKSPACE"
      | "CHANGE-VISIBILITY"
      | "DELETE-COLLABORATORS"
      | "ADD-COLLABORATORS"
      | "GET-SPACE-NAME"
      | "VERIFY-COLLABORATORS"
      | "UPDATE-COLLAB-ROLE"
  ): Promise<boolean> {
    switch (type) {
      case "DELETE-WORKSPACE":
        if (data.workspaceId) {
          await Promise.all([
            this.spaceRepository.deleteWorkspace(data.workspaceId),
            this.folderRepository.deleteFolderWithWorkspace(data.workspaceId),
            this.listRepository.deleteListWithWspace(data.workspaceId),
            this.taskRepository.deleteTaskWithWorkspace(data.workspaceId),
            this.todoRepository.deleteTodoWithWorkspace(data.workspaceId),
          ]);
          return true;
        }

        break;

      case "CHANGE-VISIBILITY":
        if (data.id && data.workspaceOwner) {
          return this.spaceRepository.changeVisibility(
            data.id,
            data.workspaceOwner
          );
        }

        break;

      case "DELETE-COLLABORATORS":
        if (data.collaboratorId && data.workspaceId) {
          let response = await this.spaceRepository.deleteCollaboratorsToSpace(
            data.workspaceId,
            data.collaboratorId
          );
          return response;
        }
        break;

      case "ADD-COLLABORATORS":
        if (data.collaboratorId && data.workspaceId) {
          let response = await this.spaceRepository.addCollaboratorsToSpace(
            data.workspaceId,
            data.collaboratorId
          );

          return response;
        }
      case "GET-SPACE-NAME":
        if (data.title) {
          const response = await this.spaceRepository.findWorkSpaceByName(
            data.title
          );
          if (response) {
            return true;
          }
          return false;
        }
        break;
      case "VERIFY-COLLABORATORS":
        if (data.workspaceId && data.collaboratorId) {
          let response = await this.spaceRepository.updateCollaboratorsVerified(
            data.workspaceId,
            data.collaboratorId
          );
          return response;
        }
      case "UPDATE-COLLAB-ROLE":
        if (data.workspaceId && data.collaboratorId && data.role) {
          return this.spaceRepository.updateCollaboratorsRole(
            data.workspaceId,
            data.collaboratorId,
            data.role
          );
        }
    }

    return false;
  }
}

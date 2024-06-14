import {
  CollaboratorType,
  WorkspaceDataType,
  workspaceSpaceJwtType,
} from "../Entities/WorkspaceDataType";
import IAuthUserService from "../Interfaces/IAuthService";
import ISpaceRepository from "../Interfaces/ISpaceRepository";
import ISpaceService from "../Interfaces/ISpaceService";

export class SpaceService implements ISpaceService {
  private spaceRepository: ISpaceRepository;
  

  constructor(spaceRepository: ISpaceRepository) {
    this.spaceRepository = spaceRepository;
   
  }
  async getAllCollaboratorInSpace(workspaceId: string): Promise<CollaboratorType[] | null> {
    let response = await this.spaceRepository.allCollaboratorInSpace(workspaceId);
    if (response) {
  
      const collaboratorsPromises: any= response.collaborators.map(async (collaborator: CollaboratorType) => {
        const assigneeDetail = await this.spaceRepository.findByIdForName(collaborator.assignee);
        return {
          assignee: assigneeDetail,
          role: collaborator.role,
        };
      });
  
      const collaborators = await Promise.all(collaboratorsPromises);
      if (collaborators && collaborators.length > 0) {
        return collaborators;
      }
    }
    return null;
  }
  
  async getAddCollaboratorsToSpace(
    workspaceId: string,
    collaboratorId: string
  ): Promise<boolean> {
    let response = await this.spaceRepository.addCollaboratorsToSpace(
      workspaceId,
      collaboratorId
    );

    return response;
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
  async getWorkSpaceByName(title: string): Promise<boolean> {
    const response = await this.spaceRepository.findWorkSpaceByName(title);
    if (response) {
      return true;
    }
    return false;
  }
  async getSingleWorkSpace(
    workspace_id: string
  ): Promise<WorkspaceDataType | null> {
    let response = await this.spaceRepository.findSingleWorkSpace(workspace_id);
    if (response) {
      return response;
    }
    return null;
  }
  async getCountInActive(workspaceOwner: string): Promise<number> {
    let response = await this.spaceRepository.findAllByUserLength(
      workspaceOwner
    );
    return response;
  }
  async getAllOnGoingSpace(
    workspaceOwner: string
  ): Promise<WorkspaceDataType[] | null> {
    return this.spaceRepository.findAllOnGoing(workspaceOwner);
  }
  changeVisible(id: string, workspaceOwner: string): Promise<boolean> {
    return this.spaceRepository.changeVisibility(id, workspaceOwner);
  }
  getAllSpaceByUser(
    workspaceOwner: string,
    pageId: number,
    limit: number
  ): Promise<WorkspaceDataType[] | null> {
    return this.spaceRepository.findAllByUser(workspaceOwner, pageId, limit);
  }

  async createSpace(
    data: Partial<WorkspaceDataType>
  ): Promise<WorkspaceDataType> {
    return this.spaceRepository.create(data);
  }
}

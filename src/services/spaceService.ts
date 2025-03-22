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

  async getWorkSpaceByName(title: string): Promise<boolean> {
    const response = await this.spaceRepository.findWorkSpaceByName(title);
    if (response) {
      return true;
    }
    return false;
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

  changeVisible(id: string, workspaceOwner: string): Promise<boolean> {
    return this.spaceRepository.changeVisibility(id, workspaceOwner);
  }

  async getDeleteWorkspace(workspaceId: string): Promise<boolean> {
    try {
      await Promise.all([
        this.spaceRepository.deleteWorkspace(workspaceId),
        this.folderRepository.deleteFolderWithWorkspace(workspaceId),
        this.listRepository.deleteListWithWspace(workspaceId),
        this.taskRepository.deleteTaskWithWorkspace(workspaceId),
        this.todoRepository.deleteTodoWithWorkspace(workspaceId),
      ]);

      return true;
    } catch (error) {
      return false;
    }
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
}

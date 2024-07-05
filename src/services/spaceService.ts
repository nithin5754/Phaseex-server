import {
  CollaboratorType,
  WorkspaceDataType,
  getCollaboratorType,
  workspaceSpaceJwtType,
} from "../Entities/WorkspaceDataType";
import { IFolderRepository } from "../Interfaces/IFolderRepository";
import { IListRepository } from "../Interfaces/IListRepository";

import ISpaceRepository from "../Interfaces/ISpaceRepository";
import ISpaceService from "../Interfaces/ISpaceService";
import { ITaskRepository } from "../Interfaces/ITaskRepository";
import { ITodoRepository } from "../Interfaces/ITodoRepository";

export class SpaceService implements ISpaceService {
  private spaceRepository: ISpaceRepository;
  private folderRepository:IFolderRepository;
  private listRepository:IListRepository;
  private taskRepository:ITaskRepository
  private todoRepository:ITodoRepository

  

  constructor(spaceRepository: ISpaceRepository,folderRepository:IFolderRepository,listRepository:IListRepository,taskRepository:ITaskRepository, todoRepository:ITodoRepository) {
    this.spaceRepository = spaceRepository;
    this.folderRepository=folderRepository
    this.listRepository=listRepository
    this.taskRepository=taskRepository
    this.todoRepository=todoRepository

   
  }
  getUpdateCollaboratorsRole(workspaceId: string, collaboratorId: string, role: string): Promise<boolean> {
   return this.spaceRepository.updateCollaboratorsRole(workspaceId,collaboratorId,role)
  }
 getAllInvitedSpace(userId: string,active:boolean): Promise<WorkspaceDataType[] | null> {
    return this.spaceRepository.findInvitedSpace(userId,active)

  }
 async getDeleteWorkspace(workspaceId: string): Promise<boolean> {
     
  let response=await this.spaceRepository.deleteWorkspace(workspaceId)

  if(!response){
   return false
  }
  let isFolderDeleted=await this.folderRepository.deleteFolderWithWorkspace(workspaceId)

  // if(!isFolderDeleted){
  //   return false
  // }

  let isListDeleted=await this.listRepository.deleteListWithWspace(workspaceId)

  // if(!isListDeleted){
  //   return false
  // }

  let isTaskDeleted=await this.taskRepository.deleteTaskWithWorkspace(workspaceId)

  // if(!isTaskDeleted){
  //   return false
  // }

  let isTodoDeleted=await this.todoRepository.deleteTodoWithWorkspace(workspaceId)

  // if(!isTodoDeleted){
  //   return false
  // }



  return response
  }
async  getUpdateCollaboratorsVerified(workspaceId: string, collaboratorId: string): Promise<boolean> {
    let response = await this.spaceRepository.updateCollaboratorsVerified(workspaceId,collaboratorId);
    return response

  }
  async getDeleteCollaboratorsToSpace(workspaceId: string, collaboratorId: string): Promise<boolean> {
    let response = await this.spaceRepository.deleteCollaboratorsToSpace(workspaceId,collaboratorId);
    return response
  }
  async getAllCollaboratorInSpace(workspaceId: string): Promise<getCollaboratorType[] | null> {
    let response = await this.spaceRepository.allCollaboratorInSpace(workspaceId);
    if (response) {
  
      const collaboratorsPromises: any= response.collaborators.map(async (collaborator: CollaboratorType) => {
        const assigneeDetail = await this.spaceRepository.findByIdForName(collaborator.assignee);
        return {
          assignee: assigneeDetail,
          role: collaborator.role,
          id:collaborator.assignee,
          verified:collaborator.verified
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

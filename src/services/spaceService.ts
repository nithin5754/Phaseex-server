import { WorkspaceDataType } from "../Entities/WorkspaceDataType";
import ISpaceRepository from "../Interfaces/ISpaceRepository";
import ISpaceService from "../Interfaces/ISpaceService";



export class SpaceService implements ISpaceService {
  private spaceRepository:ISpaceRepository 

  constructor(spaceRepository:ISpaceRepository){
    this.spaceRepository=spaceRepository

  }
  getAllSpaceByUser(workspaceOwner: string): Promise<WorkspaceDataType[] | null> {
     
    return this.spaceRepository.findAllByUser(workspaceOwner)
  }

  async createSpace(data: Partial<WorkspaceDataType>): Promise<WorkspaceDataType> {
     return this.spaceRepository.create(data)  
  }

}
import { FolderDataType } from "../Entities/Folder";
import { IFolderRepository } from "../Interfaces/IFolderRepository";
import { IFolderService } from "../Interfaces/IFolderService";




export class FolderService implements IFolderService  {
  private folderRepository:IFolderRepository;
  
  constructor(folderRepository:IFolderRepository) {
    this.folderRepository=folderRepository
    
  }
 async getAllFolderByWorkSpaceId(workspaceId: string): Promise<FolderDataType[] | null> {

  const response=await this.folderRepository.getAllFolder(workspaceId)
  if(!response){
    return null
  }
  return response
  
  }
  async createNewFolder(data: Partial<FolderDataType>): Promise<FolderDataType | null> {
    const response=await this.folderRepository.createFolder(data)
    if(!response){
      return null
    }
    return response
  }
}
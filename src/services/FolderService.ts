import { FolderDataType } from "../Entities/Folder";
import { IFolderRepository } from "../Interfaces/IFolderRepository";
import { IFolderService } from "../Interfaces/IFolderService";




export class FolderService implements IFolderService  {
  private folderRepository:IFolderRepository;
  
  constructor(folderRepository:IFolderRepository) {
    this.folderRepository=folderRepository
    
  }
 async updateFolder(data: Partial<FolderDataType>, folderId: string): Promise<FolderDataType | null> {
    const response=await this.folderRepository.updateFolder(data,folderId)
    if(response){
     return response
    }
    return null
   }
  
  async getFolderById(spaceId: string, folderId: string): Promise<FolderDataType | null> {
   const response=await this.folderRepository.findByIdFolder(spaceId,folderId)
   if(response){
    return response
   }
   return null
  }
  async getDuplicateFolder(folder_title: string, workspaceId: string): Promise<boolean> {
    const response=await this.folderRepository.findDuplicateFolder(folder_title,workspaceId)
    if(response){
      return true
    }
    return false
       
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
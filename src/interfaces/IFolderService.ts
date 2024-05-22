import { FolderDataType } from "../Entities/Folder";






export interface IFolderService {
  createNewFolder(data:Partial<FolderDataType>):Promise<FolderDataType|null>
  getAllFolderByWorkSpaceId(workspaceId:string):Promise<FolderDataType[]|null>
  getDuplicateFolder(folder_title:string,workspaceId:string):Promise<boolean>
  getFolderById(spaceId: string,folderId:string):Promise<FolderDataType|null>

  
updateFolder(data:Partial<FolderDataType>,folderId:string):Promise<FolderDataType|null>

}
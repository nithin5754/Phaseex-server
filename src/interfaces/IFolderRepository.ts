import { FolderDataType } from "../Entities/Folder";






export interface IFolderRepository {
   
createFolder(data:Partial<FolderDataType>):Promise<FolderDataType|null>
getAllFolder(workspaceId:string):Promise<FolderDataType[]|null>
findByIdFolder(id:string):Promise<FolderDataType>
  
}



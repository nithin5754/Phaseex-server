import { FolderDataType } from "../Entities/Folder";






export interface IFolderService {
  createNewFolder(data:Partial<FolderDataType>):Promise<FolderDataType|null>
  getAllFolderByWorkSpaceId(workspaceId:string):Promise<FolderDataType[]|null>
}
import { FolderDataType } from "../Entities/Folder";






export interface IFolderRepository {
   
createFolder(data:Partial<FolderDataType>):Promise<FolderDataType|null>
getAllFolder(workspaceId:string):Promise<FolderDataType[]|null>
findByIdFolder(spaceId: string,folderId:string):Promise<FolderDataType|null>
findDuplicateFolder(folder_title:string,workspaceId:string):Promise<boolean>

updateFolder(data:Partial<FolderDataType>,folderId:string):Promise<FolderDataType|null>

deleteFolder(workspaceId:string,folderId:string):Promise<boolean>
deleteFolderWithWorkspace(workspaceId:string):Promise<boolean>

}



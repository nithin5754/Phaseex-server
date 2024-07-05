import { FolderDataType } from "../../../../Entities/Folder";
import { IFolderRepository } from "../../../../Interfaces/IFolderRepository";
import { Folder as FolderModal } from "../models/FolderModal";
import moment from "moment";


    



export class FolderRepository implements IFolderRepository {
 async deleteFolderWithWorkspace(workspaceId: string): Promise<boolean> {
    const deletedFolder = await FolderModal.deleteMany({ workspaceId });
    return !!deletedFolder
  }
  async deleteFolder(workspaceId: string, folderId: string): Promise<boolean> {
    const deletedFolder = await FolderModal.findOneAndDelete({ workspaceId,_id:folderId });
  return !!deletedFolder

         
  }
 async updateFolder(data: Partial<FolderDataType>, folderId: string): Promise<FolderDataType | null> {
    const response = await FolderModal.findByIdAndUpdate({_id:folderId}, data, { new: true });
    console.log(response,"is updated");

    
    if (response) {
      let responseData: FolderDataType = {
        id: response._id.toString() as string,
        folder_title: response.folder_title,
        workspaceId: response.workspaceId?.toString() as string,
        folder_description: response.folder_description,
        createdAt:moment(response.createdAt).format('MMMM D, YYYY - h:mm A'),
        updatedAt:moment(response.updatedAt).format('MMMM D, YYYY - h:mm A'),
      };
      return responseData;
    } else {
      return null;
    }
    
  }




 async  findDuplicateFolder(folder_title: string, workspaceId: string): Promise<boolean> {
  const response=await FolderModal.find({folder_title,workspaceId})
  console.log(response,"is yest db")
  if(response.length>0){
     return true
  }
 return false
  }
 async getAllFolder(workspaceId: string): Promise<FolderDataType[] | null> {
       
          let response=await FolderModal.find({workspaceId}).sort({ createdAt: -1 })
          console.log(response,"folder");
          
          if (response) {
             let responseData:FolderDataType[]=response.map((folder)=>(
              {
                id: folder._id.toString() as string,
                folder_title: folder.folder_title,
                workspaceId: folder.workspaceId?.toString() as string,
                folder_description: folder.folder_description,
                createdAt:moment(folder.updatedAt).format('MMMM D, YYYY - h:mm A'),
                updatedAt: moment(folder.updatedAt).format('MMMM D, YYYY - h:mm A'),
              }
             ))
             return responseData
          }else{
            return null
          }
  }
  async createFolder(
    data: Partial<FolderDataType>
  ): Promise<FolderDataType | null> {
    let response = await FolderModal.create(data);
    console.log(response,"new folder")

    if (response) {
      let responseData: FolderDataType = {
        id: response._id.toString() as string,
        folder_title: response.folder_title,
        workspaceId: response.workspaceId?.toString() as string,
        folder_description: response.folder_description,
        createdAt:moment(response.createdAt).format('MMMM D, YYYY - h:mm A'),
        updatedAt:moment(response.updatedAt).format('MMMM D, YYYY - h:mm A'),
      };
      return responseData;
    } else {
      return null;
    }
  }
 async findByIdFolder(spaceId: string,folderId:string): Promise<FolderDataType|null> {
     
    let response=await FolderModal.findOne({_id:folderId,workspaceId:spaceId})

    if(response){
      let responseData: FolderDataType = {
        id: response._id.toString() as string,
        folder_title: response.folder_title,
        workspaceId: response.workspaceId?.toString() as string,
        folder_description: response.folder_description,
        createdAt:moment(response.createdAt).format('MMMM D, YYYY - h:mm A'),
        updatedAt:moment(response.updatedAt).format('MMMM D, YYYY - h:mm A'),
      }
      return responseData
    }
    return null
  }
}

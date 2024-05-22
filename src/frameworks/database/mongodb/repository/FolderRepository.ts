import { FolderDataType } from "../../../../Entities/Folder";
import { IFolderRepository } from "../../../../Interfaces/IFolderRepository";
import { Folder as FolderModal } from "../models/FolderModal";
import moment from "moment";




// export interface FolderDataType {
//   id:string
//   folder_title:string,
//   folder_description:string,
//   workspaceId:string,
//   createdAt:Date,
//   updatedAt:Date
// }
export class FolderRepository implements IFolderRepository {
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
  findByIdFolder(id: string): Promise<FolderDataType> {
    throw new Error("Method not implemented.");
  }
}

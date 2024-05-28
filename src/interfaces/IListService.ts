import { ListDataType } from "../Entities/List";
import { ListDataTypePage } from "./IListRepository";



export interface IListService {


  createList(workspaceId:string,folderId:string,listData:Partial<ListDataType>):Promise<ListDataType|null>
  isListExist(workspaceId:string,folderId:string,listTitle:string):Promise<Boolean>
  getallList(workspaceId:string,folderId:string):Promise<ListDataType[]|null>


  getAllListPage(workspaceId:string,folderId:string,page:string):Promise<ListDataTypePage>
  getUpdatePriority(workspaceId:string,folderId:string,listId:string,priority:string):Promise<boolean>

  getUpdateListDate(workspaceId:string,folderId:string,listId:string,list_start_date:string,list_due_date:string):Promise<boolean>
}
import { ListCollaboratorDetailType, ListDataType, listCollabRole } from "../Entities/List";
import { TaskType } from "../Entities/Task";
import { ListDataTypePage } from "./IListRepository";



export interface IListService {


  createList(workspaceId:string,folderId:string,listData:Partial<ListDataType>):Promise<ListDataType|null>
  isListExist(workspaceId:string,folderId:string,listTitle:string):Promise<Boolean>
  getallList(workspaceId:string,folderId:string):Promise<ListDataType[]|null>


  getAllListPage(workspaceId:string,folderId:string,page:string):Promise<ListDataTypePage>
  getUpdatePriority(workspaceId:string,folderId:string,listId:string,priority:string):Promise<boolean>

  getUpdateListDate(workspaceId:string,folderId:string,listId:string,list_start_date:string,list_due_date:string):Promise<boolean>
  getSingleList(workspaceId:string,folderId:string,listId:string):Promise<ListDataType|null>

  getAddCollabToList(workspaceId:string,folderId:string,listId:string,collabId:string):Promise<boolean>

  getListCollabByListId(workspaceId:string,folderId:string,listId:string):Promise<ListCollaboratorDetailType[]|null>

  getUpdateListCollabByListId(workspaceId:string,folderId:string,listId:string,collabId:string,role:listCollabRole):Promise<boolean>

  getDeleteListCollabByListId(workspaceId:string,folderId:string,listId:string,collabId:string,):Promise<boolean>

  checkCollabIsExistInTasks(workspaceId:string,folderId:string,listId:string,collaboratorId:string):Promise<boolean>

  
  getDeleteList(
    workspaceId: string,
    folderId: string,
    listId: string,
  ): Promise<boolean>;

}
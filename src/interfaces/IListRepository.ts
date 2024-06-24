import { ListCollaboratorDetailType, ListDataType, listCollabRole } from "../Entities/List";



export interface ListDataTypePage{
  lists:ListDataType[]|null,
  total:number


}


export interface IListRepository {

  createNewList(workspaceId:string,folderId:string,listData:Partial<ListDataType>):Promise<ListDataType|null>
  listExist(workspaceId:string,folderId:string,listTitle:string):Promise<Boolean>
  listExistById(workspaceId:string,folderId:string,listId:string):Promise<Boolean>
  allList(workspaceId:string,folderId:string):Promise<ListDataType[]|null>

  getCountLists(workspaceId:string,folderId:string):Promise<number>

  allListPage(workspaceId:string,folderId:string,page:string):Promise<ListDataType[]|null>

  updatePriority(workspaceId:string,folderId:string,listId:string,priority:string):Promise<boolean>
  updateListDate(workspaceId:string,folderId:string,listId:string,list_start_date:string,list_due_date:string):Promise<boolean>

  addCollabToList(workspaceId:string,folderId:string,listId:string,collabId:string):Promise<boolean>
  singleList(workspaceId:string,folderId:string,listId:string):Promise<ListDataType|null>

  updateProgressTask(workspaceId:string,folderId:string,listId:string,percentage:number):Promise<boolean>

listCollabByListId(workspaceId:string,folderId:string,listId:string):Promise<ListCollaboratorDetailType[]|null>
updateListCollabByListId(workspaceId:string,folderId:string,listId:string,collabId:string,role:listCollabRole):Promise<boolean>


deleteListCollabByListId(workspaceId:string,folderId:string,listId:string,collabId:string,):Promise<boolean>

checkCollaboratorInList(workspaceId:string, folderId:string, listId:string, collaboratorId:string):Promise<boolean>



}
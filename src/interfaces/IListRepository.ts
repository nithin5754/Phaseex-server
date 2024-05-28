import { ListDataType } from "../Entities/List";



export interface ListDataTypePage{
  lists:ListDataType[]|null,
  total:number


}


export interface IListRepository {

  createNewList(workspaceId:string,folderId:string,listData:Partial<ListDataType>):Promise<ListDataType|null>
  listExist(workspaceId:string,folderId:string,listTitle:string):Promise<Boolean>
  allList(workspaceId:string,folderId:string):Promise<ListDataType[]|null>

  getCountLists(workspaceId:string,folderId:string):Promise<number>

  allListPage(workspaceId:string,folderId:string,page:string):Promise<ListDataType[]|null>

  updatePriority(workspaceId:string,folderId:string,listId:string,priority:string):Promise<boolean>
  updateListDate(workspaceId:string,folderId:string,listId:string,list_start_date:string,list_due_date:string):Promise<boolean>

}
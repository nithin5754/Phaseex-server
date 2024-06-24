import { TodoType } from "../Entities/Todo";
import { UserType } from "../Entities/Users";
import { ISearchRepository } from "../Interfaces/ISearchRepository";
import { ISearchService } from "../Interfaces/ISearchService";
import { STaskCollabType, WorkSpaceCollabType } from "../frameworks/database/mongodb/repository/searchRepository";




 export class SearchService implements ISearchService {
  private searchRepository:ISearchRepository
  constructor(searchRepository:ISearchRepository) {
    this.searchRepository=searchRepository
  }
  async getSearchCollaboratorInTask(workspaceId: string, folderId: string, listId: string, taskId: string, collabKey: string): Promise<STaskCollabType[] | null> {
    let response=await this.searchRepository.searchCollaboratorInTask(workspaceId,folderId,listId,taskId,collabKey)

    if(response&&response.length>0){
      return response
    }

    return null
   }
  async getSearchCollaboratorInSpace(workspaceId: string, collabKey: string): Promise<WorkSpaceCollabType[]|null> {
    let response=await this.searchRepository.searchCollaboratorInSpace(workspaceId,collabKey)

    if(response&&response.length>0){
      return response
    }

    return null
    
   }
  async  getSearchTodo(workspaceId: string, folderId: string, listId: string, taskId: string, todoKey: string): Promise<TodoType[] | null> {
    let response=await this.searchRepository.searchTodo(workspaceId,folderId,listId,taskId,todoKey)

    if(response&&response.length>0){
      return response
    }

    return null
   }
  async getSearchUsers(searchKey: string): Promise<UserType[] | null> {
    
    let response=await this.searchRepository.searchUsers(searchKey)

    if(response&&response.length>0){
      return response
    }

    return null
       
   }
 }
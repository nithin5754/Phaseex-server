import { UserType } from "../Entities/Users";
import { ISearchRepository } from "../Interfaces/ISearchRepository";
import { ISearchService } from "../Interfaces/ISearchService";




 export class SearchService implements ISearchService {
  private searchRepository:ISearchRepository
  constructor(searchRepository:ISearchRepository) {
    this.searchRepository=searchRepository
  }
  async getSearchUsers(searchKey: string): Promise<UserType[] | null> {
    
    let response=await this.searchRepository.searchUsers(searchKey)

    if(response&&response.length>0){
      return response
    }

    return null
       
   }
 }
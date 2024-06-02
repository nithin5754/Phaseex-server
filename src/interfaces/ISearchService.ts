import { UserType } from "../Entities/Users";




export interface ISearchService {


  getSearchUsers(searchKey:string):Promise<UserType[]|null>

}
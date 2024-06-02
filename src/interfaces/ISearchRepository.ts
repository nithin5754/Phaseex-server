import { UserType } from "../Entities/Users";






export interface ISearchRepository {

  searchUsers(searchKey:string):Promise<UserType[]|null>

}
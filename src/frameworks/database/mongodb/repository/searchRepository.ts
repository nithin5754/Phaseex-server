import { User, UserType } from "../../../../Entities/Users";
import { ISearchRepository } from "../../../../Interfaces/ISearchRepository";
import  UserModal from "../models/UserModel";

export class SearchRepo implements ISearchRepository {
  constructor() {
    
  }
 
  async searchUsers(searchKey:string):Promise<UserType[]|null> {

    let response=await UserModal.find({
      "$or":[
        {userName:{$regex:searchKey}}
      ]
    })

    if(response){
      let responseData:UserType[]=response.map((user)=>({
        id:user._id,
        userName:user.userName,
        email:user.email,
        profile_image:user.profile_image,
        roles:user.roles,
        verified:user.verified,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt
      }))

      return responseData
    }

    return null


    
  }

  


}
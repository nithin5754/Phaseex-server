import { Console } from "console";
import { User  } from "../../../../Entities/Users";
import IAuthRepository from "../../../../interfaces/IAuthRepository";
import { ERROR } from "../../../webserver/common/error";

import UserTempModel from "../models/tempUser";

import UserModel from '../models/UserModel'




export class AuthRepository implements IAuthRepository {

async  createUser(data: User): Promise<User> {
    
      const newUser=await UserModel.create(data)
      return newUser
   
    
  }
 async findByEmailFromTemp(email: string): Promise<User | null> {
         const isTempUserExisting=await UserTempModel.findOne( {email})
       return isTempUserExisting

  }
 
   async registerTempUser(data: User): Promise<User> {

    const newTempUser:User=await UserTempModel.create(
    data
    )

     return newTempUser
  }
async  findByEmail(email: string): Promise<User|null> {
    const data:User|null=await UserModel.findOne(
      {email})
        
      if(data){
        return data

      }else{

        return null;
      }
  }


  async  verifyOtp(otp: string, email: string): Promise<boolean> {
    
      const isUserExisting=await this.findByEmailFromTemp(email)
       console.log(isUserExisting,"otp-verify");
       
      if(!isUserExisting){
        return false
      }

       if(isUserExisting.otp===otp){
    return true
       }

       return false
  }

}
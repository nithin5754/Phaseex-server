
import { User  } from "../../../../Entities/Users";
import IAuthRepository from "../../../../Interfaces/IAuthRepository";

import UserTempModel from "../models/tempUser";

import UserModel from '../models/UserModel'





export class AuthRepository implements IAuthRepository {
  async resendToOtp (otp: string, email: string): Promise<boolean> {

console.log("otp",otp,"///email",email);

let response=  await UserTempModel.updateOne(
      {email },
      { $set: { otp } },
    );

 if(!response) false

  return true

  }
 async findEmailAndChangePassword(email: string, hashedNewPassword: string): Promise<boolean> {
    const result = await UserModel.updateOne(
      { email },
      { $set: { password:hashedNewPassword } } 
    );

    return result.modifiedCount > 0;
  }



 async forgotPassWordVerified(userData: User): Promise<boolean> {
     
  const result = await UserTempModel.updateOne(
    { email: userData.email },
    { $set: { forgotPassWord_verified: true } } 
  );
  console.log(result,"is upadted");
  
  return result.modifiedCount > 0;
       
  }


  
 async deleteTempUser(email: string): Promise<boolean> {
    let isDeleted=await UserTempModel.findOneAndDelete({email})
    if(!isDeleted){
      return false
    }
    return true
  }

 async findById(id: string): Promise<User|null> {
  let found= await UserModel.findById(id)
   if(!found){
    return null
   }else{
    return found
   }
  }


  async  findEmailFromTokenId(tokenId: string): Promise<User | null> {
    const isTempUserExisting=await UserTempModel.findOne( {verify_token:tokenId})
    return isTempUserExisting
  }

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
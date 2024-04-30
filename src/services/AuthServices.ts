
import { User } from "../Entities/Users";

import { ERROR } from "../frameworks/webserver/common/error";
import IAuthRepository from "../interfaces/IAuthRepository";
import IAuthUserService from "../interfaces/IAuthService";
import { IBcrypt } from "../interfaces/IBcrypt";
import { IMailer } from "../interfaces/IMailer";
import { IGenerateOtp } from "../interfaces/IGenerateOtp";







export  class AuthServices implements IAuthUserService {

     private authRepository:IAuthRepository
     private bcrypt:IBcrypt
     private mailer:IMailer
     private generateOtp:IGenerateOtp


       constructor (authRepository:IAuthRepository,bcrypt:IBcrypt,mailer:IMailer,generateOtp:IGenerateOtp){
        this.authRepository=authRepository,
        this.bcrypt=bcrypt
        this.mailer=mailer
        this.generateOtp=generateOtp

       }
  async loginUserService(email: string, password: string): Promise<User | null> {
     
      const isUserExist=await this.authRepository.findByEmail(email)
      if(!isUserExist){
        throw new ERROR.UserExistsError("user not found check the details")
      }
       const isPasswordMatch:boolean=await this.bcrypt.compare(password,isUserExist.password)

       if(!isPasswordMatch){
        throw new ERROR.PasswordMismatchError("password not corrected")
       }

       return isUserExist


  }


 async verifyNewUser(emailVerify: string,otp:string): Promise<User|null> {
      
  const isTempUserExisting=await this.authRepository.findByEmailFromTemp(emailVerify)

  if(!isTempUserExisting){
    throw new ERROR.OTPExpiredError("user not found")
  }
  
  const verificationCheck=await this.authRepository.verifyOtp(otp,emailVerify)

  
  if (!verificationCheck) {
    throw new ERROR.InvalidInputError('Invalid OTP...')
}


const {profile_image,email,password,roles,userName,}=isTempUserExisting


const userData:User={
  profile_image,
  email,
  password,
  roles,
  userName,
  verified:true
}



const savingNewUser=await this.authRepository.createUser(userData)

if(!savingNewUser){
 throw new ERROR.ErrorCreatingNewUser("error occur registering new User")
 
}

return savingNewUser
     
  }  
   async tempRegisterAndSendOtp(data: User): Promise<User> {

      const isUserExisting=await this.authRepository.findByEmail(data.email)

       if(isUserExisting){
        throw new Error("user already exist");
        
       }

       const passwordToHash=await this.bcrypt.Encrypt(data.password)


       const createOtp=await this.generateOtp.createOtp(6)

       const sendMail=await this.mailer.SendEmail(data.userName,data.email,createOtp)

       const userData:User={
        ...data,password: passwordToHash,otp:createOtp
       }



       const newTempUser=await this.authRepository.registerTempUser(userData)
       if(!newTempUser){
       throw new ERROR.ErrorTempUser("error creating new temp user")
       }

       return newTempUser
         
    }


   
    

  }



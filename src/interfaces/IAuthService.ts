import { User } from "../Entities/Users";

interface IAuthUserService {
  tempRegisterAndSendOtp(data: User): Promise<User>;
  tempRegisterDb(data:User):Promise<User>
  verifyNewUser( otp: string,verify_token:string): Promise<User | null>;
  loginUserService(password:string, hashPassword:string):Promise<boolean>
  isTempTokenIDcheck(tokenId:string):Promise<User|null>

  isEmailChangePassword(email:string,password:string):Promise<boolean>

   generateToken(userId: string,roles:string[]): {
    accessToken: string;
    refreshToken: string;
  };
  verifyRefreshToken(token:string):any
  generateAccessToken(userId:string):string

  isEmailExist(email:string):Promise<User|null>

  isTokenVerified(token:string):Promise<boolean>
  
  createAndSendOtpForgot(userData:User):Promise<User|null>

  update_Verified_forgotPassWord(userData:User):Promise<boolean>

  verifyResendOtp(email:string):Promise<boolean>



  
 
}

export default IAuthUserService;

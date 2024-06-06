import { User } from "../Entities/Users";
import { workspaceSpaceJwtType } from "../Entities/WorkspaceDataType";
import { TokenGenerateProps } from "../External- Libraries/token";

interface IAuthUserService {
  tempRegisterAndSendOtp(data: User): Promise<User>;
  tempRegisterDb(data:User):Promise<User>
  verifyNewUser( otp: string,verify_token:string): Promise<User | null>;
  loginUserService(password:string, hashPassword:string):Promise<boolean>
  isTempTokenIDcheck(tokenId:string):Promise<User|null>

  isEmailChangePassword(email:string,password:string):Promise<boolean>

   generateToken(userId:string,roles:string,spaces:workspaceSpaceJwtType[]|null): {
    accessToken: string;
    refreshToken: string;
  };
  verifyRefreshToken(token:string):any
  generateAccessToken(userId:string,roles:string,spaces:workspaceSpaceJwtType[]|null):string

  isEmailExist(email:string):Promise<User|null>
  findUserById(_id:string):Promise<User|null>
  isTokenVerified(token:string):Promise<boolean>
  
  createAndSendOtpForgot(userData:User):Promise<User|null>

  update_Verified_forgotPassWord(userData:User):Promise<boolean>

  verifyResendOtp(email:string):Promise<boolean>



  
 
}

export default IAuthUserService;

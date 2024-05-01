import { User } from "../Entities/Users";

interface IAuthUserService {
  tempRegisterAndSendOtp(data: User): Promise<User>;
  verifyNewUser(email: string, otp: string): Promise<User | null>;
  loginUserService(email:string,password:string):Promise<User|null>

   generateToken(userId: string): {
    accessToken: string;
    refreshToken: string;
  };
  verifyRefreshToken(token:string):any
  generateAccessToken(userId:string):string
}

export default IAuthUserService;

import { User } from "../Entities/Users";

interface IAuthUserService {
  tempRegisterAndSendOtp(data: User): Promise<User>;
  verifyNewUser(email: string, otp: string): Promise<User | null>;
  loginUserService(email:string,password:string):Promise<User|null>
}

export default IAuthUserService;

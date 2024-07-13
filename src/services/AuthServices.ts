import { User } from "../Entities/Users";
import { v4 as uuidv4 } from "uuid";
import { ERROR } from "../frameworks/webserver/common/error";
import IAuthRepository from "../Interfaces/IAuthRepository";
import IAuthUserService from "../Interfaces/IAuthService";
import { IBcrypt } from "../Interfaces/IBcrypt";
import { IMailer } from "../Interfaces/IMailer";
import { IGenerateOtp } from "../Interfaces/IGenerateOtp";
import { IToken } from "../Interfaces/IToken";
import { TokenGenerateProps } from "../External- Libraries/token";
import { workspaceSpaceJwtType } from "../Entities/WorkspaceDataType";


export class AuthServices implements IAuthUserService {
  private authRepository: IAuthRepository;
  private bcrypt: IBcrypt;
  private mailer: IMailer;
  private generateOtp: IGenerateOtp;
  private token:IToken


  constructor(
    authRepository: IAuthRepository,
    bcrypt: IBcrypt,
    mailer: IMailer,
    generateOtp: IGenerateOtp,
    token:IToken
   
  ) {
    (this.authRepository = authRepository), (this.bcrypt = bcrypt);
    this.mailer = mailer;
    this.generateOtp = generateOtp;
    this.token=token
 
  }
  async findUserById(_id: string): Promise<User | null> {
    let found=await this.authRepository.findById(_id)
    return found
  }
  async verifyResendOtp( email: string):Promise<boolean>{
     
    let isEmailExist=await this.authRepository.findByEmailFromTemp(email)
  if(!isEmailExist){
      return false
  }  
  
   let otp= this.generateOtp.createOtp(6)

  let isOtpChanged=await this.authRepository.resendToOtp(otp,email)

  if(!isOtpChanged){
    return false
  }
 

  const sendMail = await this.mailer.SendEmail(
    isEmailExist?.userName,
    email,
    otp

  );



  


  return true


    
  }
  async isEmailChangePassword(email: string, password: string): Promise<boolean> {
    
       const hashedNewPassword=await this.bcrypt.Encrypt(password)
      

         let changePassword=await this.authRepository.findEmailAndChangePassword(email,hashedNewPassword)

         if(!changePassword) return false

         return true
  }
  isTempTokenIDcheck(tokenId: string): Promise<User | null> {
    return this.authRepository.findEmailFromTokenId(tokenId)
  }


  update_Verified_forgotPassWord(userData: User): Promise<boolean> {
   return this.authRepository.forgotPassWordVerified(userData)
  }
  async createAndSendOtpForgot(userData: User): Promise<User | null> {
    

    
    let isEmailExist= await this.authRepository.deleteTempUser(userData.email)

    
    
    const createOtp= this.generateOtp.createOtp(6)
    
     const token=uuidv4()
     console.log(token,"token")
     const TempData: User = {
       otp: createOtp,
       verify_token: token,
       userName:userData.userName,
       email:userData.email,
       password:userData.password,
       roles:userData.roles
     };

       const isTempDetailsCreated=await this.authRepository.registerTempUser(TempData)
       return isTempDetailsCreated

  }
  isTokenVerified(token: string): Promise<boolean> {
    return  this.token.verifyAccessToken(token)
  }


  generateAccessToken(userId:string,roles:string,spaces:workspaceSpaceJwtType[]|null): string {
    return this.token.accessTokenGenerator(userId,roles,spaces)
  }
  verifyRefreshToken(token: string) {
     return this.token.verifyRefreshToken(token)
  }


  generateToken(userId:string,roles:string,spaces:workspaceSpaceJwtType[]|null):{
    accessToken:string;
    refreshToken:string
  }{
    return this.token.generateTokens(userId,roles,spaces)
  }

 async isEmailExist(email: string): Promise<User|null> {
  const user=await this.authRepository.findByEmail(email)
  return user
  }

  async loginUserService(
    password: string,
    hashPassword:string
  ): Promise<boolean> {
   

    const isPasswordMatch: boolean = await this.bcrypt.compare(
      password,
      hashPassword
    );

    return isPasswordMatch;
  }

  async verifyNewUser(otp:string,verify_token:string): Promise<User | null> {

 
     const  isUserTokenExist=await this.authRepository.findEmailFromTokenId(verify_token)

     if(!isUserTokenExist){
      throw new ERROR.isTempUserExisting("ERROR IN TOKEN -NOT FOUND")
     }



    const isTempUserExisting = await this.authRepository.findByEmailFromTemp(
      isUserTokenExist.email
    );

    if (!isTempUserExisting) {
      throw new ERROR.OTPExpiredError("user not found");
    }

    const verificationCheck = await this.authRepository.verifyOtp(
      otp,
      isUserTokenExist.email
    );

    if (!verificationCheck) {
        
        
      throw new ERROR.InvalidInputError("Invalid OTP...");
    }

    const { profile_image, email, password, roles, userName } =
      isTempUserExisting;

 


    const userData: User = {
      profile_image,
      email,
      password,
      roles,
      userName,
      verified: true,

   
    };

    

    const savingNewUser = await this.authRepository.createUser(userData);

    if (!savingNewUser) {
      throw new ERROR.ErrorCreatingNewUser("error occur registering new User");
    }

    return savingNewUser;
  }
  async tempRegisterAndSendOtp(data: User): Promise<User> {

    const isTempUserAlreadyExist=await this.authRepository.deleteTempUser(data.email)
    if(isTempUserAlreadyExist){
      console.log(isTempUserAlreadyExist,"is temp user");
      
    }

    const passwordToHash = await this.bcrypt.Encrypt(data.password);

    const createOtp = await this.generateOtp.createOtp(6);


    const sendMail = await this.mailer.SendEmail(
      data.userName,
      data.email,
      createOtp

    );
    const token=uuidv4()
    console.log(token,"token")

    const userData: User = {
      ...data,
      password: passwordToHash,
      otp: createOtp,
      verify_token:token
      
    };

    return userData

  }


  async tempRegisterDb(data: User): Promise<User> {
        const newTempUser = await this.authRepository.registerTempUser(data);
    return newTempUser;
  }
}

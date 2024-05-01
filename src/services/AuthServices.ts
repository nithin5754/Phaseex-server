import { User } from "../Entities/Users";
import { v4 as uuidv4 } from "uuid";
import { ERROR } from "../frameworks/webserver/common/error";
import IAuthRepository from "../Interfaces/IAuthRepository";
import IAuthUserService from "../Interfaces/IAuthService";
import { IBcrypt } from "../Interfaces/IBcrypt";
import { IMailer } from "../Interfaces/IMailer";
import { IGenerateOtp } from "../Interfaces/IGenerateOtp";
import { IToken } from "../Interfaces/IToken";


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
  generateAccessToken(userId: string): string {
    return this.token.accessTokenGenerator(userId)
  }
  verifyRefreshToken(token: string) {
     return this.token.verifyRefreshToken(token)
  }

  generateToken(foundUser:string):{
    accessToken:string;
    refreshToken:string
  }{
    return this.token.generateTokens(foundUser)
  }

  async loginUserService(
    email: string,
    password: string
  ): Promise<User | null> {
    const isUserExist = await this.authRepository.findByEmail(email);
    if (!isUserExist) {
      throw new ERROR.UserExistsError("user not found check the details");
    }
    const isPasswordMatch: boolean = await this.bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isPasswordMatch) {
      throw new ERROR.PasswordMismatchError("password not corrected");
    }

    return isUserExist;
  }

  async verifyNewUser(emailVerify: string, otp: string): Promise<User | null> {
    const isTempUserExisting = await this.authRepository.findByEmailFromTemp(
      emailVerify
    );

    if (!isTempUserExisting) {
      throw new ERROR.OTPExpiredError("user not found");
    }

    const verificationCheck = await this.authRepository.verifyOtp(
      otp,
      emailVerify
    );

    if (!verificationCheck) {
      throw new ERROR.InvalidInputError("Invalid OTP...");
    }

    const { profile_image, email, password, roles, userName } =
      isTempUserExisting;

      const token=uuidv4()
      console.log(token,"token")
      

    const userData: User = {
      profile_image,
      email,
      password,
      roles,
      userName,
      verified: true,
      verify_token:token
    };

    const savingNewUser = await this.authRepository.createUser(userData);

    if (!savingNewUser) {
      throw new ERROR.ErrorCreatingNewUser("error occur registering new User");
    }

    return savingNewUser;
  }
  async tempRegisterAndSendOtp(data: User): Promise<User> {
    const isUserExisting = await this.authRepository.findByEmail(data.email);

    if (isUserExisting) {
      throw new Error("user already exist");
    }

    const passwordToHash = await this.bcrypt.Encrypt(data.password);

    const createOtp = await this.generateOtp.createOtp(6);

    const sendMail = await this.mailer.SendEmail(
      data.userName,
      data.email,
      createOtp
    );

    const userData: User = {
      ...data,
      password: passwordToHash,
      otp: createOtp,
    };

    const newTempUser = await this.authRepository.registerTempUser(userData);
    if (!newTempUser) {
      throw new ERROR.ErrorTempUser("error creating new temp user");
    }

    return newTempUser;
  }
}

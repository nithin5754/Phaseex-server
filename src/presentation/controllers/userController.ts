import { NextFunction, Request, Response } from "express";
import IAuthUserService from "../../Interfaces/IAuthService";
import { AuthServices } from "../../Services/AuthServices";


export class UserController {
  private authService: IAuthUserService;

  constructor(authService: IAuthUserService) {
    this.authService = authService;
  }

  //@register
  onRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    console.log(req.body, "hello body");

    try {
      const isUserEmailExist = await this.authService.isEmailExist(body.email);
      if (isUserEmailExist) {
        return res.status(404).json({ message: "user already exist" });
      }

      const isOtpSend = await this.authService.tempRegisterAndSendOtp(body);
      if (!isOtpSend) {
        return res
          .status(404)
          .json({ message: "error occur please try again ,later" });
      }

      const data = await this.authService.tempRegisterDb(isOtpSend);

      if (!data) {
        return res
          .status(404)
          .json({ message: "error occur please try again ,later" });
      }
      return res.json(data);
    } catch (error) {
      next(error);
    }
  };

  OnVeryOtpAndRegister = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body);
      const { otp, tokenId } = req.body;
      let verify_token: string = tokenId;
      const response = await this.authService.verifyNewUser(otp, verify_token);

      res.status(200).json({
        data: response?.userName,
        message: "User Created and signed in  Successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  //@login
  OnLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    console.log(email, password, "login-page");

    try {
      if (!email || !password) {
        return res.status(404).json({
          message: "invalid inputs",
        });
      }

      const isUserExist = await this.authService.isEmailExist(email);
      if (!isUserExist) {
        return res.status(400).json({
          message: "user not found check the details ",
        });
      }

      const response = await this.authService.loginUserService(
        password,
        isUserExist.password
      );

      if (!response) {
        return res.status(400).json({
          message: "wrong credentials,try again ",
        });
      }

      if (isUserExist?._id) {
        const { accessToken, refreshToken } = this.authService.generateToken(
          isUserExist._id
        );

        console.log(accessToken);

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "none",
        });

        return res.status(200).json({
          message: "user login successfully",
          data: isUserExist,
          accessToken: accessToken,
        });
      } else {
        return res.status(400).json({
          message: "wrong credentials",
        });
      }
    } catch (error) {
      next(error);
    }
  };

  //@login

  onRefresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies;

      if (!cookies?.jwt)
        return res.status(401).json({ message: "Unauthorized" });

      const refreshToken = cookies.jwt;

      const decodedToken = this.authService.verifyRefreshToken(refreshToken);
      if (!decodedToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const userId = decodedToken.userId;

      const accessToken = this.authService.generateAccessToken(userId);

      return res.status(200).json({ accessToken: accessToken });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @description logout a user
   * @param req.cookies
   * @returns accesstoken and userinfo
   */

  onLogOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies;
      console.log(cookies, "jwt");

      if (!cookies?.jwt) return res.sendStatus(204);
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      return res.status(200).json({ message: "cookie cleared" });
    } catch (error) {
      next(error);
    }
  };

  //verify-token

  verifyToken = async (req: Request, res: Response) => {
    try {
      const token = req.body.token;
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      const isAuthenticated = await this.authService.isTokenVerified(token);
      if (isAuthenticated) {
        return res
          .status(200)
          .json({
            message: "Token is valid",
            isAuthenticated: isAuthenticated,
          });
      } else {
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  //@home

  home = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("welcome home");

      return res
        .status(200)
        .json({
          message: "welcome home",
          result: ["nithin", "nivin", "joji", "nelvin", "sindu"],
        });
    } catch (error) {
      next(error);
    }
  };

  forgotPasswordSendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const email = req.body.email;
      const isEmailExist = await this.authService.isEmailExist(email);
      if (!isEmailExist) {
        return res.status(404).json({ message: "user not found" });
      }

      let isSend = await this.authService.createAndSendOtpForgot(isEmailExist);
      if (!isSend) {
        return res
          .status(400)
          .json({ message: "error occurred please try again" });
      }
      return res.status(200).json({ isSend });
    } catch (error) {
      next(error);
    }
  };
  onVerifyForgotOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.body);
      const { otp, tokenId } = req.body;

      let verify_token: string = tokenId;
      const response = await this.authService.verifyNewUser(otp, verify_token);
      if (!response) {
        return res
          .status(400)
          .json({ message: "error in verifying credentials" });
      }
      const verifyTheForgotPasswordCheck =
        this.authService.update_Verified_forgotPassWord(response);

        if(!verifyTheForgotPasswordCheck){
          return res
          .status(400)
          .json({ message: "error in verifying credentials please try later" });
        }

      return res
        .status(200)
        .json({ message: "successfully verified forgot otp" ,tokenId});
    } catch (error) {
      next(error);
    }
  };


  changePasswordAfterVerification=async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
       const {password,tokenId}=req.body

       const isEmailExist=await this.authService.isTempTokenIDcheck(tokenId)


       if(!isEmailExist){
       return  res.status(404).json({message:"user not found"})
       }
  
       if(isEmailExist.forgotPassWord_verified!==true){
        return  res.status(404).json({message:"please try later"})
        }

       const isPasswordChanged:boolean=await this.authService.isEmailChangePassword(isEmailExist.email,password)

       return  res
       .status(200)
       .json({ message: "password successfully changed" ,isPasswordChanged});
       


  }

resendOtp=async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const tokenId: string = req.body.tokenId

      console.log(tokenId,"token verified");
      

      let isEmailExist=await this.authService.isTempTokenIDcheck(tokenId)

      if(!isEmailExist){
       return res.status(404).json({message:"credentials not found! please try again later"})
      }
      let email:string=isEmailExist?.email as string
 
      let isOtpChanged=this.authService.verifyResendOtp(email)
      if(!isOtpChanged){
       return res.status(404).json({message:"credentials not found! please try again later"})
      }

      let isEmailExistAfterOtp=await this.authService.isTempTokenIDcheck(tokenId)

      if(!isEmailExistAfterOtp){
        return res.status(404).json({message:"credentials not found! please try again later"})
      }

      

      return res.status(200).json({message:"resend otp successfully created",updateDate:isEmailExistAfterOtp?.updatedAt,authId:isEmailExist?.verify_token})

    } catch (error) {
      next(error)
    }
  }

  onUpdateDateTempUser=async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
      const tokenId=req.body.tokenId
    
      try {
        const isUpdateDateExist=await this.authService.isTempTokenIDcheck(tokenId)

      if(!isUpdateDateExist){
        return res.status(404).json({message:"timer is not found"})
      }

      let updateTempUserDate=isUpdateDateExist?.updatedAt
      console.log(updateTempUserDate,"time fdate get from backend ");
      

      return res.status(200).json({message:"successfully ",updateDate:updateTempUserDate})
      } catch (error) {
        next(error)
      }
    
  }
}

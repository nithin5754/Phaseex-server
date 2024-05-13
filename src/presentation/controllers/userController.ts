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

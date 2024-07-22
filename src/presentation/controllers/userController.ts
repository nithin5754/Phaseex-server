import { NextFunction, Request, Response } from "express";
import IAuthUserService from "../../interfaces/IAuthService";
import { AuthServices } from "../../Services/AuthServices";

export class UserController {
  private authService: IAuthUserService;

  constructor(authService: IAuthUserService) {
    this.authService = authService;
  }

  //@register
  onRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;


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

      const { otp, tokenId } = req.body;
      let verify_token: string = tokenId;
      const response = await this.authService.verifyNewUser(otp, verify_token);
      if (!response) {
        return res
          .status(404)
          .json({ message: "error occur please try again ,later" });
      }

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenId: string = req.body.tokenId;

      console.log(tokenId, "token verified");

      let isEmailExist = await this.authService.isTempTokenIDcheck(tokenId);

      if (!isEmailExist) {
        return res
          .status(404)
          .json({ message: "credentials not found! please try again later" });
      }
      let email: string = isEmailExist?.email as string;

      let isOtpChanged = this.authService.verifyResendOtp(email);
      if (!isOtpChanged) {
        return res
          .status(404)
          .json({ message: "credentials not found! please try again later" });
      }

      let isEmailExistAfterOtp = await this.authService.isTempTokenIDcheck(
        tokenId
      );

      if (!isEmailExistAfterOtp) {
        return res
          .status(404)
          .json({ message: "credentials not found! please try again later" });
      }

      return res
        .status(200)
        .json({
          message: "resend otp successfully created",
          updateDate: isEmailExistAfterOtp?.updatedAt,
          authId: isEmailExist?.verify_token,
        });
    } catch (error) {
      next(error);
    }
  };

  onUpdateDateTempUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const tokenId = req.body.tokenId;

    try {
      const isUpdateDateExist = await this.authService.isTempTokenIDcheck(
        tokenId
      );

      if (!isUpdateDateExist) {
        return res.status(404).json({ message: "timer is not found" });
      }

      let updateTempUserDate = isUpdateDateExist?.updatedAt;


      return res.status(200).json({ updateDate: updateTempUserDate });
    } catch (error) {
      next(error);
    }
  };

  onfindLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let userID: string = req.userId;

      const getName = await this.authService.findUserById(userID);
      if (!getName) {
        return res.status(404).json({ message: "not found" });
      }


      return res.status(200).json(getName);
    } catch (error) {
      next(error);
    }
  };

  onGetUserById =async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let userId=req.userId 

   
    

     let response=await this.authService.findUserById(userId)
   
     if(!response){
      return res.status(404).json({message:"not found please try again!"})
     }

     return res.status(200).json(response)

  }
}

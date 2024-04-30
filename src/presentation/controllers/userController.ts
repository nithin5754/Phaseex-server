import { NextFunction, Request, Response } from "express";
import IAuthUserService from "../../interfaces/IAuthService";
import { ERROR } from "../../frameworks/webserver/common/error";

export class UserController {
  private authService: IAuthUserService;
  constructor(authService: IAuthUserService) {
    this.authService = authService;
  }

  onRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    try {
      if (req.body.confirmPassword !== req.body.password) {
        throw new ERROR.PasswordMismatchError("password not matching");
      }
      const newUser = await this.authService.tempRegisterAndSendOtp(body);
      return res
        .status(200)
        .json({ message: "successfully create new user", data: newUser });
    } catch (error) {
      next(error);
    }
  };

  
  veryOtpAndRegister=async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email,otp}=req.body
        
    const response=await this.authService.verifyNewUser(email,otp)   
   
    
    res.status(200).json({ data: response?.userName, message: "User Created and signed in  Successfully" })
  } catch (error) {
    next(error)
  }
  }


  loginUser=async(req:Request,res:Response,next:NextFunction)=>{
    const {email,password}=req.body

        try {
          if(!email||!password){
            throw new ERROR.InvalidInputError("invalid input")
          }
    
          const response=await this.authService.loginUserService(email,password)
      
          return res.status(200).json({
            message:"user login sucessfully",
            data:response
          })
    
        } catch (error) {
          next(error)
        }
  }
 

}

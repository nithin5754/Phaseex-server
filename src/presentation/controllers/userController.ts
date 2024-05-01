import { NextFunction, Request, Response } from "express";
import IAuthUserService from "../../Interfaces/IAuthService";
import { ERROR } from "../../frameworks/webserver/common/error";
import { IValidation } from "../../Interfaces/IValidation";



export class UserController {
  private authService: IAuthUserService;
  private validation: IValidation;
  constructor(authService: IAuthUserService, validation: IValidation) {
    this.authService = authService;
    this.validation = validation;
  }

  onRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    try {

      const newUser = await this.authService.tempRegisterAndSendOtp(body);
      return res
        .status(200)
        .json({ message: "successfully create new user", data: newUser });
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
      const { email, otp } = req.body;

      const response = await this.authService.verifyNewUser(email, otp);

      res.status(200).json({
        data: response?.userName,
        message: "User Created and signed in  Successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  OnLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      if (!email || !password) {
        throw new ERROR.InvalidInputError("invalid input");
      }

      if (!this.validation.checkEmail(req.body.email)) {
        throw new ERROR.InvalidInputError("Invalid email format");
      }
      if (!this.validation.checkPassword(req.body.password)) {
        throw new ERROR.InvalidInputError("Invalid password format");
      }

      const response = await this.authService.loginUserService(email, password);



        if(response?._id){

        

      const {accessToken,refreshToken}=this.authService.generateToken(response._id )

      console.log(accessToken)


      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7*24 * 60 * 60 * 1000,
        sameSite:'none'
      });

      return     res.status(200).json({
        message: "user login successfully",
        data: response,
        accessToken:accessToken
      });

        }else{
          return res.status(401).json({ error: "Invalid credentials" });

        }

  
    } catch (error) {
      next(error);
    }
  };


   refresh=async(req:Request,res:Response,next:NextFunction)=>{

   try {
    const cookies=req.cookies

    if(!cookies?.jwt)return res.status(401).json({message:'Unauthorized'})

      const refreshToken=cookies.jwt

      const decodedToken = this.authService.verifyRefreshToken(refreshToken)
      if (!decodedToken) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      const userId = decodedToken.userId;

      const accessToken=this.authService.generateAccessToken(userId)

      return res.status(200).json({accessToken:accessToken})

  
   } catch (error) {
    next(error)  
   }
     

   }

   logOut=async(req:Request,res:Response,next:NextFunction)=>{
    try {
    const cookies=req.cookies
    if(!cookies?.jwt)return res.sendStatus(204)
      res.clearCookie('jwt',{httpOnly:true,sameSite:'none',secure:true})

     return res.status(200).json({message:"cookie cleared"})
    } catch (error) {
     next(error)
    }
}


   home=async(req:Request,res:Response,next:NextFunction)=>{
       try {
        console.log("welcome home")

        return res.status(200).json({message:"welcome home"})
       } catch (error) {
        next(error)
       }
   }
}

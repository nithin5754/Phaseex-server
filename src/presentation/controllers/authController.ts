import { NextFunction, Request, Response } from "express";
import IAuthUserService from "../../interfaces/IAuthService";
import ISpaceService from "../../interfaces/ISpaceService";

import { IGoogleService } from "../../interfaces/IGoogleService";

import { ICloudinaryStorage } from "../../interfaces/ICloudinaryStorage";
import { IMulterConverter } from "../../interfaces/IMulterConverter";

export class AuthController {
  private authService: IAuthUserService;
  private spaceService: ISpaceService;
  private googleService: IGoogleService;
  private ICloudinary: ICloudinaryStorage;
  private multerConverter: IMulterConverter;

  constructor(
    authService: IAuthUserService,
    spaceService: ISpaceService,
    googleService: IGoogleService,
    ICloudinary: ICloudinaryStorage,
    multerConverter: IMulterConverter
  ) {
    this.authService = authService;
    this.spaceService = spaceService;
    this.googleService = googleService;
    this.ICloudinary = ICloudinary;
    this.multerConverter = multerConverter;
  }
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

      //  let roles:string[]=[...isUserExist.roles]
      if ((isUserExist?._id, isUserExist.roles)) {
        let spaces = await this.spaceService.getAllSpaceByOwner(
          isUserExist._id!
        );

        let userId = isUserExist._id as string;
        let roles = isUserExist.roles;
        const { accessToken, refreshToken } = this.authService.generateToken(
          userId,
          roles,
          spaces
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

  onGoogleAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("hello");
      
      const { token } = req.body;

      console.log(req.body,"token")

      if (!token) {
        return res.status(404).json({ message: "credetials missing" });
      }

      let isUserExist = await this.googleService.googleAuthentication(token);
      if (isUserExist && isUserExist?._id && isUserExist.roles) {
        let spaces = await this.spaceService.getAllSpaceByOwner(
          isUserExist._id!
        );

        let userId = isUserExist._id as string;
        let roles = isUserExist.roles;
        const { accessToken, refreshToken } = this.authService.generateToken(
          userId,
          roles,
          spaces
        );

      

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
      }

      return res.status(404).json("error");
    } catch (error) {
      next(error);
    }
  };

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

      const foundUser = await this.authService.findUserById(userId);

      if (!foundUser) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      if (foundUser._id && foundUser.roles) {
        let spaces = await this.spaceService.getAllSpaceByOwner(foundUser._id!);
        let userId = foundUser._id;
        let roles = foundUser.roles;
        const accessToken = this.authService.generateAccessToken(
          userId,
          roles,
          spaces
        );
        return res
          .status(200)
          .json({ accessToken: accessToken, data: foundUser });
      }
      return res.status(403).json({ message: "Invalid refresh token" });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   * @description logout a user
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
        return res.status(200).json({
          message: "Token is valid",
          isAuthenticated: isAuthenticated,
        });
      } else {
        return res.status(401).json({ message: "Invalid token" });
      }
    } catch (error) {

      console.error("Error verifying token:", error);
      return res.status(403).json({ message: "Internal server error" });
    }
  };

  //@home

  home = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("welcome home");

      return res
        .status(200)
        .json({ message: "sucessfully", data: "hell welcome to my world" });
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
      return res.status(200).json(isSend);
    } catch (error) {
      console.log("HEY NITHIN JOIJI THIS MY HOMe");
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

      if (!verifyTheForgotPasswordCheck) {
        return res
          .status(400)
          .json({ message: "error in verifying credentials please try later" });
      }

      return res
        .status(200)
        .json({ message: "successfully verified forgot otp", tokenId });
    } catch (error) {
      next(error);
    }
  };

  changePasswordAfterVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { password, tokenId } = req.body;

      const isEmailExist = await this.authService.isTempTokenIDcheck(tokenId);

      if (!isEmailExist) {
        return res.status(404).json({ message: "user not found" });
      }

      if (isEmailExist.forgotPassWord_verified !== true) {
        return res.status(404).json({ message: "please try later" });
      }

      const isPasswordChanged: boolean =
        await this.authService.isEmailChangePassword(
          isEmailExist.email,
          password
        );

      if (!isPasswordChanged) {
        return res
          .status(404)
          .json({
            message: "something went wrong please try after sometime..",
          });
      }

      return res
        .status(200)
        .json({ message: "password successfully changed", isPasswordChanged });
    } catch (error) {
      next(error);
    }
  };

  onAddProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const file = req.file;

      console.log(userId, "multer file in userId");

      if (!userId) {
        return res
          .status(404)
          .json({ message: "credentials not matching please try again later" });
      }

      if (!file) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again later" });
      }

      let dataURI = this.multerConverter.convertFileToString(file);

      const isUploaded = await this.ICloudinary.uploadPhoto(dataURI);
      if (!isUploaded) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again" });
      }

      let isImageToSever = await this.authService.getAddProfile(
        userId,
        isUploaded.url
      );

      if (!isImageToSever) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again" });
      }

      return res
        .status(200)
        .json({ profile_image: isImageToSever?.profile_image });
    } catch (error) {
      next(error);
    }
  };
}

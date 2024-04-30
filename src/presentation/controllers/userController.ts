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
      if (
        !this.validation.isPassWordMatch(
          req.body.password,
          req.body.confirmPassword
        )
      ) {
        throw new ERROR.PasswordMismatchError("password not matching");
      }

      if (!this.validation.checkEmail(req.body.email)) {
        throw new ERROR.InvalidInputError("Invalid email format");
      }
      if (!this.validation.checkPassword(req.body.password)) {
        throw new ERROR.InvalidInputError("Invalid password format");
      }

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

      return res.status(200).json({
        message: "user login sucessfully",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };
}

import { Request, Response, Router } from "express";
import { AuthRepository } from "../../frameworks/database/mongodb/repository/authRepository";
import { Bcrypt } from "../../External- Libraries/bcrypt";
import { Mailer } from "../../External- Libraries/mailer";
import { GenerateOtp } from "../../External- Libraries/generateOtp";
import { Token } from "../../External- Libraries/token";
import { AuthServices } from "../../services/AuthServices";
import { UserController } from "../controllers/userController";
import { validateRegisterUser } from "../validators/authValidator";
import { verifyJWT } from "../middleware/validateToken";

const repository = new AuthRepository();
const bcrypt = new Bcrypt();
const mailer = new Mailer();
const generateOtp = new GenerateOtp();
const token = new Token();

const services = new AuthServices(
  repository,
  bcrypt,
  mailer,
  generateOtp,
  token
);

const controller = new UserController(services);

const userRouter = (router: Router) => {
  router
    .route("/register")
    .post(validateRegisterUser, controller.onRegisterUser.bind(controller));
  router
    .route("/verify")
    .post(controller.OnVeryOtpAndRegister.bind(controller));
  router
    .route("/get-timer-date")
    .post(controller.onUpdateDateTempUser.bind(controller));
  router.route("/resendOtp").post(controller.resendOtp.bind(controller));
  router.route("/getUserName").get(controller.onfindLoginUser.bind(controller));

  router
    .route("/getUserById")
    .get(verifyJWT, controller.onGetUserById.bind(controller));
  return router;
};

export default userRouter;

import { Request, Response, Router } from "express";
import { UserController } from "../controllers/userController";
import { AuthServices } from "../../services/AuthServices";
import { AuthRepository } from "../../frameworks/database/mongodb/repository/authRepository";
import { Bcrypt } from "../../external-libaries/bcrypt";
import { Mailer } from "../../external-libaries/mailer";
import { GenerateOtp } from "../../external-libaries/generateOtp";


const repository = new AuthRepository();
const bcrypt=new Bcrypt()
const mailer=new Mailer()
const generateOtp=new GenerateOtp
const services = new AuthServices(repository,bcrypt,mailer,generateOtp);
const controller = new UserController(services);

const authRouter = (router: Router) => {

 router.route('/register').post(controller.onRegisterUser);


 router.route('/verify').post(controller.veryOtpAndRegister)

 router.route('/login').post(controller.loginUser)



 return router;
}

export default authRouter;

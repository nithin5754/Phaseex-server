import { Request, Response, Router } from "express";
import { UserController } from "../controllers/userController";
import { AuthServices } from "../../Services/AuthServices";
import { AuthRepository } from "../../frameworks/database/mongodb/repository/authRepository";
import { Bcrypt } from "../../External-Libaries/bcrypt";
import { Mailer } from "../../External-Libaries/mailer";
import { GenerateOtp } from "../../External-Libaries/generateOtp";
import { Validation } from "../utils/validation";


const repository = new AuthRepository();
const bcrypt=new Bcrypt()
const mailer=new Mailer()
const generateOtp=new GenerateOtp
const services = new AuthServices(repository,bcrypt,mailer,generateOtp);
const validation=new Validation()
const controller = new UserController(services,validation);

const authRouter = (router: Router) => {

 router.route('/register').post(controller.onRegisterUser);


 router.route('/verify').post(controller.OnVeryOtpAndRegister)

 router.route('/login').post(controller.OnLoginUser)




 return router;
}

export default authRouter;

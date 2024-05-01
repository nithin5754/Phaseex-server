import { Request, Response, Router } from "express";
import { UserController } from "../controllers/userController";
import { AuthServices } from "../../Services/AuthServices";
import { AuthRepository } from "../../frameworks/database/mongodb/repository/authRepository";
import { Bcrypt } from "../../External- Libraries/bcrypt";
import { Mailer } from "../../External- Libraries/mailer";
import { GenerateOtp } from "../../External- Libraries/generateOtp";
import { Validation } from "../utils/validation";
import { Token } from "../../External- Libraries/token";
import { verifyJWT } from "../middleware/validateToken";
import { validateLoginUser, validateRegisterUser } from "../validators/authValidator";



const repository = new AuthRepository();
const bcrypt=new Bcrypt()
const mailer=new Mailer()
const generateOtp=new GenerateOtp
const token=new Token()

const services = new AuthServices(repository,bcrypt,mailer,generateOtp,token);
const validation=new Validation()
const controller = new UserController(services,validation);

const authRouter = (router: Router) => {

 router.route('/register').post(validateRegisterUser,controller.onRegisterUser);


 router.route('/verify').post(controller.OnVeryOtpAndRegister)

 router.route('/login').post(validateLoginUser,controller.OnLoginUser)

 router.route('/refresh').get(controller.refresh)
 router.route('/logout').get(controller.logOut)


 router.route('/home').get(verifyJWT,controller.home)




 return router;
}

export default authRouter;



import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";
import { WorkSpaceController } from "../controllers/workSpaceController";
import { AuthServices } from "../../Services/AuthServices";
import { AuthRepository } from "../../frameworks/database/mongodb/repository/authRepository";
import { Bcrypt } from "../../External- Libraries/bcrypt";
import { Mailer } from "../../External- Libraries/mailer";
import { GenerateOtp } from "../../External- Libraries/generateOtp";
import { Token } from "../../External- Libraries/token";
import { SpaceService } from "../../Services/spaceService";
import { workSpaceRepository } from "../../frameworks/database/mongodb/repository/workspaceRepository";


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

const spaceRepository=new workSpaceRepository()

const spaceService=new SpaceService(spaceRepository)

const controller=new WorkSpaceController(services,spaceService)

const spaceRoutes = (router: Router) => {

 router.use(verifyJWT)
 router.route('/workspace')
 .get(controller.onGetAllWorkSpaceByUser.bind(controller))
 .post(controller.onCreateNewSpace.bind(controller))



  return router

}


export default spaceRoutes;
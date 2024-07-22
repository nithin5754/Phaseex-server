import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";
import { CommentsController } from "../controllers/CommentsController";
import { CommentsService } from "../../services/CommentsService";
import { CommentsRepo } from "../../frameworks/database/mongodb/repository/CommentsRepo";
import { AuthServices } from "../../services/AuthServices";
import { AuthRepository } from "../../frameworks/database/mongodb/repository/authRepository";
import { Bcrypt } from "../../External- Libraries/bcrypt";
import { Mailer } from "../../External- Libraries/mailer";
import { GenerateOtp } from "../../External- Libraries/generateOtp";
import { Token } from "../../External- Libraries/token";


const UserRepository = new AuthRepository();
const bcrypt = new Bcrypt();
const mailer = new Mailer();
const generateOtp = new GenerateOtp();
const token = new Token();

const UserServices = new AuthServices(
  UserRepository,
  bcrypt,
  mailer,
  generateOtp,
  token
);

let repository = new CommentsRepo();

let service = new CommentsService(repository);

let controller = new CommentsController(service,UserServices);

const commentRoutes = (router: Router) => {
  router.use(verifyJWT);

  router
    .route("/add-top-level-comment/:todoId")
    .post(controller.onAddTopLevelComment.bind(controller));

  router
    .route("/reply-comment/:todoId")
    .post(controller.onAddReplyLevelComment.bind(controller));

  router
    .route("/get-all-comment")
    .get(controller.onGetAllCommentByTodoId.bind(controller));

router
.route('/count-comment').get(controller.onGetCountAllDocuments.bind(controller))

  return router;
};

export default commentRoutes;

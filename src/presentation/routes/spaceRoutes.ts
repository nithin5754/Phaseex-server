import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";
import { WorkSpaceController } from "../controllers/workSpaceController";
import { AuthServices } from "../../services/AuthServices";
import { AuthRepository } from "../../frameworks/database/mongodb/repository/authRepository";
import { Bcrypt } from "../../External- Libraries/bcrypt";
import { Mailer } from "../../External- Libraries/mailer";
import { GenerateOtp } from "../../External- Libraries/generateOtp";
import { Token } from "../../External- Libraries/token";
import { SpaceService } from "../../services/spaceService";
import { workSpaceRepository } from "../../frameworks/database/mongodb/repository/workspaceRepository";
import { FolderRepository } from "../../frameworks/database/mongodb/repository/FolderRepository";
import { ListRepository } from "../../frameworks/database/mongodb/repository/ListRepository";
import { TaskRepository } from "../../frameworks/database/mongodb/repository/taskRepository";
import { TodoRepository } from "../../frameworks/database/mongodb/repository/todoRepository";

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

const spaceRepository = new workSpaceRepository();
const folderRepository = new FolderRepository();
const listRepository = new ListRepository();
const taskRepository = new TaskRepository();
const todoRepository = new TodoRepository();

const spaceService = new SpaceService(
  spaceRepository,
  folderRepository,
  listRepository,
  taskRepository,
  todoRepository
);

const controller = new WorkSpaceController(services, spaceService);

const spaceRoutes = (router: Router) => {
  router.use(verifyJWT);
  router
    .route("/workspace")
    // .get(controller.onGetAllWorkSpaceByUser.bind(controller))
    .post(controller.onCreateNewSpace.bind(controller));
  router
    .route("/workspace/owner")
    .get(controller.onGetAllOwnerSpaceLists.bind(controller));
  router
    .route("/workspace/hidden")
    .get(controller.onGetAllHiddenSpaceLists.bind(controller));
  router
    .route("/workspace/invited")
    .get(controller.onGetAllInvitedSpaceLists.bind(controller));

  router
    .route("/workspace/details/:id")
    .get(controller.onGetSingleWorkSpace.bind(controller));

  router
    .route("/workspace/change/visibility")
    .post(controller.onChangeVisibility.bind(controller));



  // router
  //   .route("/allInactive-workspace")
  //   .get(controller.onInActiveCount.bind(controller));

  router
    .route("/workspace/add/members")
    .post(controller.onAddCollaboratorsToSpace.bind(controller));

  router
    .route("/workspace/members/:workspaceId")
    .get(controller.OnGetAllCollaboratorsInSpace.bind(controller));

  router
    .route("/workspace/delete/members")
    .delete(controller.onDeleteCollabrators.bind(controller));

  router
    .route("/workspace/verify/member")
    .patch(controller.onVerifyCollaborator.bind(controller));

  router
    .route("/workspace/delete/:workspaceId")
    .post(controller.onDeleteWorkspace.bind(controller));

  router
    .route("/workspace/members/role/update")
    .patch(controller.onUpdateSpaceRoles.bind(controller));

  return router;
};

export default spaceRoutes;

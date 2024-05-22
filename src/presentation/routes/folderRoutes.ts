import { Router } from "express";
import { FolderRepository } from "../../frameworks/database/mongodb/repository/FolderRepository";
import { FolderService } from "../../Services/FolderService";
import { FolderController } from "../controllers/FolderController";
import { verifyJWT } from "../middleware/validateToken";

const repository = new FolderRepository();
const service = new FolderService(repository);
const controller = new FolderController(service);

const folderRoutes = (router: Router) => {
  router.use(verifyJWT);

  router
    .route("/space-folder")
    .post(controller.onCreateNewFolder.bind(controller));

  router
    .route("/get-folder/:id")
    .get(controller.onGetAllFolder.bind(controller));
  return router;
};

export default folderRoutes;

import { Router } from "express";
import { ListController } from "../controllers/ListController";
import { ListService } from "../../services/ListService";
import { ListRepository } from "../../frameworks/database/mongodb/repository/ListRepository";
import { verifyJWT } from "../middleware/validateToken";

let listRepository = new ListRepository();

let listService = new ListService(listRepository);
let controller = new ListController(listService);

const listRoutes = (router: Router) => {
  router.use(verifyJWT);
  router.route("/create").post(controller.onCreateList.bind(controller));
  router.route("/get-all-list").get(controller.onGetAllList.bind(controller));
  router
    .route("/get-all-list-page")
    .get(controller.onGetAllListPage.bind(controller));
  router
    .route("/update-priority-list/:listId")
    .patch(controller.onUpdatePriorityList.bind(controller));
  router
    .route("/update-date-list/:listId")
    .patch(controller.onUpdateListDate.bind(controller));

  router
    .route("/get-single-list")
    .get(controller.onGetSingleList.bind(controller));





  
  return router;
};

export default listRoutes;

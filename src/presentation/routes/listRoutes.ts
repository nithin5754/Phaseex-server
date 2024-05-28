import { Router } from "express";
import { ListController } from "../controllers/ListController";
import { ListService } from "../../Services/ListService";
import { ListRepository } from "../../frameworks/database/mongodb/repository/ListRepository";

let listRepository = new ListRepository();
let listService = new ListService(listRepository);
let controller = new ListController(listService);

const listRoutes = (router: Router) => {
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

  return router;
};

export default listRoutes;

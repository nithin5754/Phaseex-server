import { Router } from "express";
import { ListController } from "../controllers/ListController";
import { ListService } from "../../Services/ListService";
import { ListRepository } from "../../frameworks/database/mongodb/repository/ListRepository";
import { TaskRepository } from "../../frameworks/database/mongodb/repository/taskRepository";
import { verifyJWT } from "../middleware/validateToken";
const taskRepository = new TaskRepository();


let listRepository = new ListRepository();

let listService = new ListService(listRepository,taskRepository);
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

  router
    .route("/add-members-list/:listId")
    .patch(controller.onAddNewMemberToList.bind(controller));

  router
    .route("/all-collab-list-id")
    .get(controller.onGetCollabByList.bind(controller));

  router
    .route("/update-collab-list-role/:collabId")
    .patch(controller.onUpdateListCollabRoles.bind(controller));

  router
    .route("/delete-collab-list-assignee/:collabId")
    .delete(controller.onDeleteCollabAssigneeFromList.bind(controller));



  
  return router;
};

export default listRoutes;

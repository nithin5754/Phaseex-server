import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";
import { TaskController } from "../controllers/taskController";
import { TaskService } from "../../services/TaskService";
import { TaskRepository } from "../../frameworks/database/mongodb/repository/taskRepository";
import { ListRepository } from "../../frameworks/database/mongodb/repository/ListRepository";
import { DueDay } from "../../External- Libraries/FindDueDate";
import { ProgressBar } from "../../External- Libraries/ProgressPercentage";
import { TodoRepository } from "../../frameworks/database/mongodb/repository/todoRepository";
import multer from "multer";

const listRepository = new ListRepository();
const taskRepository = new TaskRepository();
const dueDate = new DueDay();
const progressBar = new ProgressBar();
const todoRepository = new TodoRepository();
const taskService = new TaskService(
  taskRepository,
  listRepository,
  dueDate,
  progressBar,
  todoRepository
);





const controller = new TaskController(taskService);
const taskRoutes = (router: Router) => {
  router.use(verifyJWT);

  router
    .route("/create-task")
    .post(controller.onCreateNewTask.bind(controller));
  router
    .route("/get-all-task")
    .get(controller.onGetAllTheTask.bind(controller));
  router
    .route("/update-priority/:taskId")
    .patch(controller.onUpdatePriorityTask.bind(controller));
  router
    .route("/update-task/:taskId")
    .patch(controller.onUpdateStatus.bind(controller));
  router
    .route("/update-task-description/:taskId")
    .patch(controller.onUpdateDescriptionTask.bind(controller));
  router
    .route("/get-all-task-count-wise")
    .get(controller.onGetAllTaskWiseCount.bind(controller));
  router
    .route("/get-single-task")
    .get(controller.onSingleList.bind(controller));

  router
    .route("/add-collab-task/:taskId")
    .patch(controller.onAddCollaboratorsToTask.bind(controller));

  router
    .route("/get-all-collab-task")
    .get(controller.onGetCollabByTask.bind(controller));

  router
    .route("/delete-collabId-task/:collabId")
    .delete(controller.onDeleteCollabIdTask.bind(controller));

  router
    .route("/check-collab-in-list-group")
    .get(controller.onTaskCollabListGrp.bind(controller));

  router
  .route('/add_link/task/:taskId')
  .patch(controller.onAddLinkToTask.bind(controller))


  router
  .route("/delete-link-task/:taskId")
  .delete(controller.onDeleteLinkTask.bind(controller));



  return router;
};

export default taskRoutes;

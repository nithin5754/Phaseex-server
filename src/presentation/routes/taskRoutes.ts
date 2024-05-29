import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";
import { TaskController } from "../controllers/taskController";
import { TaskService } from "../../Services/TaskService";
import { TaskRepository } from "../../frameworks/database/mongodb/repository/taskRepository";
import { ListRepository } from "../../frameworks/database/mongodb/repository/ListRepository";

const listRepository = new ListRepository();
const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository, listRepository);

const controller = new TaskController(taskService);
const taskRoutes = (router: Router) => {
  // router.use(verifyJWT);

  router.route("/create-task").post(controller.onCreateNewTask.bind(controller));

  return router;
};

export default taskRoutes;

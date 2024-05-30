import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";
import { TaskController } from "../controllers/taskController";
import { TaskService } from "../../Services/TaskService";
import { TaskRepository } from "../../frameworks/database/mongodb/repository/taskRepository";
import { ListRepository } from "../../frameworks/database/mongodb/repository/ListRepository";
import { DueDay } from "../../External- Libraries/FindDueDate";


const listRepository = new ListRepository();
const taskRepository = new TaskRepository();
const dueDate=new DueDay()
const taskService = new TaskService(taskRepository, listRepository,dueDate);

const controller = new TaskController(taskService);
const taskRoutes = (router: Router) => {
  router.use(verifyJWT);

  router.route("/create-task").post(controller.onCreateNewTask.bind(controller));
  router.route('/get-all-task').get(controller.onGetAllTheTask.bind(controller))
  router.route('/update-priority/:taskId').patch(controller.onUpdatePriorityTask.bind(controller))
  router.route('/update-date/:taskId').patch(controller.onUpdateTaskDate.bind(controller))

  return router;
};

export default taskRoutes;

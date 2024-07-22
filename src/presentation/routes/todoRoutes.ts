import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";
import { TodoController } from "../controllers/TodoController";
import { TodoService } from "../../services/TodoService";
import { TodoRepository } from "../../frameworks/database/mongodb/repository/todoRepository";

const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const controller = new TodoController(todoService);

const todoRoutes = (router: Router) => {

  /**
   * @description authenticating route in globally
   */

  router.use(verifyJWT);

  router
    .route("/get-all-todo-task")
    .get(controller.onGetAllTodoTask.bind(controller));
  router
    .route("/create-todo-task")
    .post(controller.onCreateTodoTask.bind(controller));
  router
    .route("/update-todo-checkbox/:todoId")
    .patch(controller.onUpdateTodoStatus.bind(controller));
  router
    .route("/update-todo-task/:todoId")
    .patch(controller.onUpdateTodoTask.bind(controller));
  router
    .route("/delete-todo-task/:todoId")
    .delete(controller.onDeleteTodoTask.bind(controller));

  router
    .route("/add-collab-todo/:todoId")
    .patch(controller.onAddCollabToTodo.bind(controller));

  router
    .route("/get-collab-todo")
    .get(controller.onGetAllTodoCollabInTodoId.bind(controller));

  router
  .route('/delete-collab-todo')
  .delete(controller.onGetDeleteTodoCollab.bind(controller))

  return router;
};

export default todoRoutes;

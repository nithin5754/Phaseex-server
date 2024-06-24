import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";
import { SearchController } from "../controllers/SearchController";
import { SearchService } from "../../Services/searchService";
import { SearchRepo } from "../../frameworks/database/mongodb/repository/searchRepository";

const searchRepository=new SearchRepo()

const searchService=new SearchService(searchRepository)

const controller = new SearchController(searchService)

const searchRouter = (router: Router) => {

  router.route('/user/:searchKey').post(controller.onSearchUsers.bind(controller))
  router.route('/todo').post(controller.onSearchTodo.bind(controller))
  router.route('/space').post(controller.onSearchSpaceCollab.bind(controller))
  router.route('/task-collab').post(controller.onSearchTaskCollab.bind(controller))

  return router;
};

export default searchRouter;
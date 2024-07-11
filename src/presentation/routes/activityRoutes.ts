


import { Router } from "express";
import { verifyJWT } from "../middleware/validateToken";
import { ActivityController } from "../controllers/activityController";
import { ActivityService } from "../../Services/ActivityService";
import { ActivityRepository } from "../../frameworks/database/mongodb/repository/ActivityRepository";

const repository = new ActivityRepository();
const service = new ActivityService(repository);
const controller = new ActivityController(service);

const activityRoutes = (router: Router) => {
  router.use(verifyJWT);

  router.route('/create-activity').post(controller.OnCreateActivity.bind(controller))
  router.route('/get-all-activity').get(controller.onGetAllActivity.bind(controller))
 
  return router;
};

export default activityRoutes;

import { Router } from "express";
import { HomeController } from "../controllers/HomeController";
import { verifyJWT } from "../middleware/validateToken";

const controller = new HomeController();

const homeRouter = (router: Router) => {
  router.route("/testing").get(verifyJWT, controller.testing.bind(controller));

  return router;
};

export default homeRouter;

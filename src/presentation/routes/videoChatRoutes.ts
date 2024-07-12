import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";
import { VideoRepository } from "../../frameworks/database/mongodb/repository/VideoRepository";
import { VideoNotiService } from "../../Services/VideoNotiService";
import { CallController } from "../controllers/CallController";

const repository = new VideoRepository();
const service = new VideoNotiService(repository);
const controller = new CallController(service);

const videoChatRoutes = (router: Router) => {
  /**
   * @description authenticating route in globally
   */

  router.use(verifyJWT);

  router
    .route("/get-video-chat-noti/:workspaceId")
    .get(controller.onGetVideoChatNotification.bind(controller));

  return router;
};

export default videoChatRoutes;

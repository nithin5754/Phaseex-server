import { Router } from "express";
import { verifyJWT } from "../middleware/validateToken";
import { ChatRepository } from "../../frameworks/database/mongodb/repository/ChatRepository";
import { ChatService } from "../../services/ChatService";
import { ChatController } from "../controllers/chatControler";

const chatRepository = new ChatRepository();

const chatService = new ChatService(chatRepository);
const controller = new ChatController(chatService);

const chatRoutes = (router: Router) => {
  router.use(verifyJWT);

  router.route("/create").post(controller.createChat.bind(controller));

  return router;
};

export default chatRoutes;







import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";
import { GPTController } from "../controllers/GPTController";
import { GptService } from "../../services/GptService";
import { GptRepository } from "../../frameworks/database/mongodb/repository/GptRepository";


const repository=new GptRepository()
const service=new GptService(repository)
const controller=new GPTController(service)


const gptRoutes = (router: Router) => {

  /**
   * @description authenticating route in globally
   */

  router.use(verifyJWT);

  router.route('/add-new-gpt-group').post(controller.onCreateGPTgroup.bind(controller))
  router.route('/get-all-group').get(controller.onGetAllGroup.bind(controller))

  router.route('/add-question').post(controller.onAddQuestion.bind(controller))

  router.route('/add-answer').post(controller.onAddAnswer.bind(controller))

  router.route('/get-all-prompt-group/:groupId').get(controller.onGetAllPromptByGroupId.bind(controller))


 

  return router;
};

export default gptRoutes;

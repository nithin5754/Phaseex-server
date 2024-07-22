import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";

import { AttachmentController } from "../controllers/attachmentController";
import { AttachmentService } from "../../services/AttachmentService";
import { AttachmentRepository } from "../../frameworks/database/mongodb/repository/AttachmentRepository";
import { MulterFileConverter } from "../../External- Libraries/multerFileConverter";
import upload from "../middleware/multer";
import { CloudinaryStorage } from "../../External- Libraries/cloudnariyStorage";

const repository = new AttachmentRepository();
const service = new AttachmentService(repository);
const multerConverter = new MulterFileConverter();
const ICloudinary = new CloudinaryStorage();
const controller = new AttachmentController(
  service,
  multerConverter,
  ICloudinary
);

const AttachmentRoutes = (router: Router) => {
  /**
   * @description authenticating route in globally
   */

  router.use(verifyJWT);

  router
    .route("/add-attachment")
    .post(
      upload.single("attachmentFile"),
      controller.OnAddAttachment.bind(controller)
    );
  router
    .route("/get-all-attachment")
    .get(controller.onGetallAttachmentByTaskId.bind(controller));

  router
    .route("/delete-single-attachment")
    .delete(controller.OnGetDeleteAttachment.bind(controller));

  return router;
};

export default AttachmentRoutes;

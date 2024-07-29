

import { Router } from "express";

import { verifyJWT } from "../middleware/validateToken";

import upload from "../middleware/multer";
import { UploadController } from "../controllers/uploadController";
import { CloudinaryStorage } from "../../External- Libraries/cloudnariyStorage";
import { MulterFileConverter } from "../../External- Libraries/multerFileConverter";


const multerConverter=new MulterFileConverter()
const ICloudinary=new CloudinaryStorage()

const controller = new UploadController(ICloudinary,multerConverter)

const UploadRoutes = (router: Router) => {

  /**
   * @description authenticating route in globally
   */

  router.use(verifyJWT);

  router
    .route("/add-gpt")
    .post( upload.single("gpt_image"),controller.onUploadFile.bind(controller));
 

  return router;
};

export default UploadRoutes;

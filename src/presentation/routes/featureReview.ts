import { Router } from "express";
import { verifyJWT } from "../middleware/validateToken";
import { FeatureReviewController } from "../controllers/FeatureReviewController";
import { FeatureReviewRepository } from "../../frameworks/database/mongodb/repository/FeatureReviewRepository";
import { FeatureReviewService } from "../../services/FeatureReviewService";
import { workSpaceRepository } from "../../frameworks/database/mongodb/repository/workspaceRepository";
import { ListRepository } from "../../frameworks/database/mongodb/repository/ListRepository";

const featureRepository = new FeatureReviewRepository();
const spaceRepository = new workSpaceRepository();
const listRepository = new ListRepository();

const featureReviewService = new FeatureReviewService(
  featureRepository,
  spaceRepository,
  listRepository
);

const featureReviewController = new FeatureReviewController(
  featureReviewService
);

const featureReviewRoutes = (router: Router) => {
  router.use(verifyJWT);

  router
    .route("/create/:workspaceId/:folderId/:listId/review")
    .post(
      featureReviewController.onCreateFeatureReview.bind(
        featureReviewController
      )
    );
  router
    .route(
      "/update-resend-list-manager/:workspaceId/:folderId/:listId/review"
    )
    .patch(
      featureReviewController.onReSendReviewByListIdByManager.bind(
        featureReviewController
      )
    );

  router
    .route("/reviewer-submit/:workspaceId/:folderId/:listId/:reviewId/review")
    .patch(
      featureReviewController.onUpdateReviewerReviewSubmit.bind(
        featureReviewController
      )
    );

  router
    .route("/get/:workspaceId/:folderId/review")
    .get(
      featureReviewController.onGetAllFeatureFolderById.bind(
        featureReviewController
      )
    );

  router
    .route("/get-list/:workspaceId/:folderId/:listId/review")
    .get(
      featureReviewController.onGetAllFeatureListById.bind(
        featureReviewController
      )
    );

  return router;
};

export default featureReviewRoutes;

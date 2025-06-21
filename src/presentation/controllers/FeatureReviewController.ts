import { NextFunction, Request, Response } from "express";
import { IFeatureProjectReviewService } from "../../interfaces/IFeatureProjectReviewService";
import { IFeatureProjectReview } from "../../interfaces/IProjectReview";

export class FeatureReviewController {
  constructor(private readonly featureReview: IFeatureProjectReviewService) {}

  async onCreateFeatureReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId, folderId, listId } = req.params;
      const userId = req.userId;

      const { featureCreatedAt, featureDueDate } = req.body;
      if (!featureCreatedAt || !featureDueDate) {
        return res
          .status(400)
          .json({ error: "featureCreatedAt and featureDueDate are required" });
      }

      const data: Partial<IFeatureProjectReview> = {
        ...req.body,
        workspaceId,
        folderId,
        listId,
        assignee: { id: userId },
      };

      const result = await this.featureReview.createReview(data);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  onGetAllFeatureFolderById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { workspaceId, folderId } = req.params;
    if (!workspaceId || !folderId) {
      return res
        .status(404)
        .json({ message: "invalid credentials please try again!!" });
    }

    try {
      const response = await this.featureReview.getAllReviewByFolderId({
        workspaceId,
        folderId,
      });
      if (!response) {
        res.status(400).json({ message: "not found" });
      }
      console.log("response", response);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  async onGetAllFeatureListById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { workspaceId, folderId, listId } = req.params;

      const response = await this.featureReview.getReviewByList({
        workspaceId,
        folderId,
        listId,
      });

      console.log('resose single folder',response)

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async onUpdateReviewByListIdByManager(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { workspaceId, folderId, listId,reviewId } = req.params;

      const { message } = req.body;

      const response:boolean = await this.featureReview.updateReviewByListIdByManager({
        message,
        folderId,
        listId,
        reviewId,
        workspaceId,
      });

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

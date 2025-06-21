import { IFeatureReviewCreateDTO, IFeatureReviewUpdateDTO } from "../services/FeatureReviewService";
import { IFeatureProjectReview } from "./IProjectReview";

export interface IFeatureProjectReviewRepository {
  createReview(data: IFeatureReviewCreateDTO): Promise<boolean>;
  getReviewByFolderId(
    data: Partial<IFeatureProjectReview>
  ): Promise<IFeatureProjectReview[]>;

  getReviewByList(
    data: Partial<IFeatureProjectReview>
  ): Promise<IFeatureProjectReview | null>;

  updateReviewByListIdByManager(data: IFeatureReviewUpdateDTO): Promise<boolean>;
}

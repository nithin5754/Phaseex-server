import { IFeatureProjectReview } from "./IProjectReview";

export interface IFeatureProjectReviewService {
  createReview(data: Partial<IFeatureProjectReview>): Promise<boolean>;
  getAllReviewByFolderId(data: {
    workspaceId: string;
    folderId: string;
  }): Promise<IFeatureProjectReview[]>;
  getReviewByList(data: {
    workspaceId: string;
    folderId: string;
    listId: string;
  }): Promise<IFeatureProjectReview | null>;

updateReviewByListIdByManager(data: {
    message: string;
    workspaceId: string;
    folderId: string;
    listId: string;
    reviewId: string;
  }): Promise<boolean>
}

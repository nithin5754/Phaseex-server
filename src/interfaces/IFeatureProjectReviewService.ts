import { IFeatureUpdateReviewerSubmitDTO } from "../services/FeatureReviewService";
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

ReSendReviewByListIdByManager(data: {
    message: string;
    workspaceId: string;
    folderId: string;
    listId: string;
  }): Promise<boolean>


  
    updateReviewerReviewSubmit(data:IFeatureUpdateReviewerSubmitDTO):Promise<boolean>
}

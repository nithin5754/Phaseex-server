import { IFeatureProjectReviewRepository } from "../../../../interfaces/IFeatureProjectReviewRepository";
import { IFeatureProjectReview } from "../../../../interfaces/IProjectReview";
import {
  IFeatureReviewCreateDTO,
  IFeatureReviewUpdateDTO,
  IFeatureUpdateReviewerSubmitDTO,
} from "../../../../services/FeatureReviewService";
import { ProjectReview } from "../models/project-review/ProjectReviewerModal";

export class FeatureReviewRepository
  implements IFeatureProjectReviewRepository
{
  async getReviewByList(
    data: Partial<IFeatureProjectReview>
  ): Promise<IFeatureProjectReview | null> {
    const response = await ProjectReview.findOne({
      workspaceId: data.workspaceId,
      folderId: data.folderId,
      listId: data.listId,
    });

    return response ? this.convertFeatureProjectData(response) : null;
  }
  private convertFeatureProjectData(data: any): IFeatureProjectReview {
    if (!data) {
      throw new Error("Invalid data provided for conversion");
    }

    return {
      id: data._id?.toString() || "",
      title: data.title || "",
      description: data.description || "",
      attempt: data.attempt || 0,
      status: data.status || "Pending",
      featureCreatedAt: data.featureCreatedAt?.toString() || "",
      workspaceId: data.workspaceId?.toString() || "",
      listId: data.listId?.toString() || "",
      folderId: data.folderId?.toString() || "",
      featureDueDate: data.featureDueDate?.toString() || "",
      message: data.message,
      assignee: data.assignee
        ? {
            id: data.assignee.id?.toString() || "",
            name: data.assignee.userName || "",
            email: data.assignee.email || "",
          }
        : { id: "", name: "", email: "" },
      reviewers:
        data.reviewers?.map(
          (r: { _id: string; userName: string; email?: string }) => ({
            id: r._id?.toString() || "",
            name: r.userName || "",
            email: r.email || "",
          })
        ) || [],
      reviewerLogs:
        data.reviewerLogs?.map((log: any) => ({
          id: log.reviewer._id?.toString() || "",
          name: log.reviewer.userName || "",
          email: log.reviewer.email || "",
          avatar: log.avatar || "",
          approvalStatus: log.approvalStatus || "Pending",
          reviewedAt: log.reviewedAt?.toString() || "",
          suggestion: log.suggestion || "",
        })) || [],
      comments: [],
      approved: data.approved || false,
      dependencies: [],
      attachments: [],
    };
  }

  private convertFeatureProjectArrayData(
    dataArray: any[]
  ): IFeatureProjectReview[] {
    if (!Array.isArray(dataArray)) {
      return [];
    }

    return dataArray.map((data) => this.convertFeatureProjectData(data));
  }

  async createReview(data: IFeatureReviewCreateDTO): Promise<boolean> {
    const result = await ProjectReview.create(data);
    return !!result;
  }

  async getReviewByFolderId(
    data: Partial<IFeatureProjectReview>
  ): Promise<IFeatureProjectReview[]> {
    const result = await ProjectReview.find({
      workspaceId: data.workspaceId,
      folderId: data.folderId,
    })
      .populate({ path: "assignee", select: "userName email" })
      .populate({ path: "reviewers", select: "userName email" })
      .populate({ path: "reviewerLogs.reviewer", select: "userName email" })
      .exec();

    const res = this.convertFeatureProjectArrayData(result);

    return res;
  }

  async ReSendReviewByListIdByManager(
    data: IFeatureReviewUpdateDTO
  ): Promise<boolean> {
    const result = await ProjectReview.updateOne(
      {
        workspaceId: data.workspaceId,
        folderId: data.folderId,
        listId: data.listId,
      },
      {
        $set: {
          status: data.status,
          attempt: data.attempt,
          message: data.message,
        },
      }
    );

    return !!result;
  }

  async updateReviewerReviewSubmit(
    data: IFeatureUpdateReviewerSubmitDTO
  ): Promise<boolean> {
    const response = await ProjectReview.updateOne(
      {
        _id: data.reviewId,
        workspaceId: data.workspaceId,
        listId: data.listId,
        folderId: data.folderId,
      },
      {
        $set: { status: data.approvalStatus, approved: data.approved },
        $addToSet: {
          reviewerLogs: {
            reviewer: data.reviewerId,
            suggestion: data.suggestion,
            approvalStatus: data.approvalStatus,
          },
        },
      }
    );

    return !!response;
  }
}

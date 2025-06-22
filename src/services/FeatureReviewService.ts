import { parse } from "date-fns";
import { IFeatureProjectReviewRepository } from "../interfaces/IFeatureProjectReviewRepository";
import { IFeatureProjectReviewService } from "../interfaces/IFeatureProjectReviewService";
import { IFeatureProjectReview } from "../interfaces/IProjectReview";
import ISpaceRepository from "../interfaces/ISpaceRepository";
import { IListRepository } from "../interfaces/IListRepository";
import { ListStatus } from "../Entities/List";

export interface IFeatureReviewCreateDTO {
  title: string;
  description: string;
  attempt?: number;
  status: "Approved" | "Rejected" | "Pending" | "Completed";
  featureCreatedAt: Date;
  listId: string;
  folderId: string;
  workspaceId: string;
  featureDueDate: Date;
  message: string[];
  assignee: string;
  reviewers: [string];
}

export interface IFeatureReviewUpdateDTO {
  message: string;
  workspaceId: string;
  folderId: string;
  listId: string;
  status: "Approved" | "Rejected" | "Pending" | "Completed";
  attempt: number;
}

export interface IFeatureUpdateReviewerSubmitDTO {
  suggestion: string;
  reviewerId: string;
  workspaceId: string;
  folderId: string;
  listId: string;
  reviewId: string;
  approvalStatus: "Approved" | "Rejected" | "Pending" | "Completed";
  approved:boolean
}

export class FeatureReviewService implements IFeatureProjectReviewService {
  constructor(
    private readonly IFPRRepository: IFeatureProjectReviewRepository,
    private readonly workspaceRepo: ISpaceRepository,
    private readonly listRepository: IListRepository
  ) {}

  async updateReviewerReviewSubmit(
    data: IFeatureUpdateReviewerSubmitDTO
  ): Promise<boolean> {
    const {
      approvalStatus,
      workspaceId,
      folderId,
      listId,
      reviewId,
      reviewerId,
      suggestion,
      approved
    } = data;

    const isValid =
      approvalStatus !== undefined &&
      workspaceId &&
      folderId &&
      listId &&
      reviewId &&
      reviewerId &&
      suggestion&&typeof approved === 'boolean'

    if (!isValid) return false;

    let status: ListStatus = "pending";

    const response = this.IFPRRepository.updateReviewerReviewSubmit(data);

    if (approvalStatus === "Approved") {
      status = "verified";
    } else if (approvalStatus === "Rejected") {
      status = "rejected";
    }

    this.listRepository.updateListStatus(workspaceId, folderId, listId, status);

    if (!response) {
      return false;
    }

    return response;
  }

  async ReSendReviewByListIdByManager(data: {
    message: string;
    workspaceId: string;
    folderId: string;
    listId: string;
  }): Promise<boolean> {
    const updateData: IFeatureReviewUpdateDTO = {
      message: data.message,
      workspaceId: data.workspaceId,
      folderId: data.folderId,
      listId: data.listId,
      status: "Pending",
      attempt: 1,
    };

    const reviewDetails = await this.IFPRRepository.getReviewByList({
      workspaceId: updateData.workspaceId,
      listId: updateData.listId,
      folderId: updateData.folderId,
    });

    if(!reviewDetails||reviewDetails.status!=='Rejected'){
      return false
    }

    if (reviewDetails) {
      updateData.attempt = reviewDetails.attempt + 1;

        const response = await this.IFPRRepository.ReSendReviewByListIdByManager(
      updateData
    );

    this.listRepository.updateListStatus(
      updateData.workspaceId,
      updateData.folderId,
      updateData.listId,
      "pending"
    );

    return response;
    }

  return false
  }
  getReviewByList(data: {
    workspaceId: string;
    folderId: string;
    listId: string;
  }): Promise<IFeatureProjectReview | null> {
    return (
      this.IFPRRepository.getReviewByList({
        workspaceId: data.workspaceId,
        folderId: data.folderId,
        listId: data.listId,
      }) ?? null
    );
  }
  getAllReviewByFolderId(data: {
    workspaceId: string;
    folderId: string;
  }): Promise<IFeatureProjectReview[]> {
    return this.IFPRRepository.getReviewByFolderId(data);
  }

  async createReview(data: Partial<IFeatureProjectReview>): Promise<boolean> {
    const {
      title,
      description,
      status,
      featureCreatedAt,
      featureDueDate,
      listId,
      workspaceId,
      folderId,
      assignee,
      message,
    } = data;

    if (
      title !== undefined &&
      title !== null &&
      description !== undefined &&
      description !== null &&
      status &&
      featureCreatedAt &&
      featureDueDate &&
      listId &&
      folderId &&
      workspaceId &&
      assignee &&
      assignee.id &&
      message
    ) {
      let isExist = await this.getReviewByList({
        workspaceId,
        folderId,
        listId,
      });

      if (isExist) return false;

      const workspaceDetails = await this.workspaceRepo.findSpaceById(
        workspaceId
      );

      const dto: IFeatureReviewCreateDTO = {
        title,
        description,
        status,
        featureCreatedAt: parse(
          featureCreatedAt,
          "MMMM d, yyyy - h:mm a",
          new Date()
        ),
        featureDueDate: parse(
          featureDueDate,
          "MMMM d, yyyy - h:mm a",
          new Date()
        ),
        listId,
        folderId,
        attempt: 1,
        workspaceId,
        message,
        assignee: assignee.id,
        reviewers: [workspaceDetails?.workspaceOwner.toString() as string],
      };

      const result = await this.IFPRRepository.createReview(dto);

      if (result) {
        await this.listRepository.updateListStatus(
          workspaceId,
          folderId,
          listId,
          "pending"
        );
        return result;
      }
    }

    return false;
  }
}

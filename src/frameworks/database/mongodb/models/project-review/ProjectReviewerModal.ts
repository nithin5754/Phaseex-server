import mongoose, { Schema } from "mongoose";

const projectReviewSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    message: [
      {
        type: String
      },
    ],
    status: {
      type: String,
      enum: ["Approved", "Rejected", "Pending", "Completed"],
      default: "Pending",
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
    listId: {
      type: Schema.Types.ObjectId,
      ref: "List",
    },
    featureCreatedAt: { type: Date, required: true, default: Date.now },
    featureDueDate: {
      type: Date,
      required: true,
    },
    attempt: {
      type: Number,
      default: 1,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reviewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reviewerLogs: [
      {
        reviewer: { type: Schema.Types.ObjectId, ref: "User", index: true },
        suggestion: {
          type: String,
        },
        approvalStatus: {
          type: String,
          enum: ["Approved", "Rejected", "Pending", "Completed"],
          default: "Pending",
        },
        reviewedAt: { type: Date, default: Date.now },
      },
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: "ProjectReviewComment" }],
    approved: { type: Boolean, default: false },
    attachments: [
      {
        name: { type: String, trim: true },
        url: {
          type: String,
        },
      },
    ],
    dependencies: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        link: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

projectReviewSchema.index({ status: 1 });
projectReviewSchema.index({ featureDueDate: 1 });

projectReviewSchema.virtual("commentsData", {
  ref: "ProjectReviewComment",
  localField: "comments",
  foreignField: "_id",
  justOne: false,
});

const ProjectReview = mongoose.model("ProjectReview", projectReviewSchema);

export { ProjectReview };

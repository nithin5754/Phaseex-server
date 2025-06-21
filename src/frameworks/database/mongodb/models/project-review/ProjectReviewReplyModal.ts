import mongoose, { Schema } from "mongoose";

const replySchema = new Schema(
  {
    comment: {
      type: Schema.Types.ObjectId,
      ref: "ProjectReviewComment",
      required: true,
      index: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Reply content cannot be empty"],
      maxlength: [1000, "Reply content cannot exceed 1000 characters"],
    },
  },
  { timestamps: true }
);

const ProjectReviewReply = mongoose.model("ProjectReply", replySchema);

export default ProjectReviewReply;

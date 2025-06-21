import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Comment content cannot be empty"],
      maxlength: [2000, "Comment content cannot exceed 2000 characters"],
    },
    replies: [{ type: Schema.Types.ObjectId, ref: "ProjectReview" }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("ProjectReviewComment", commentSchema);

export default Comment
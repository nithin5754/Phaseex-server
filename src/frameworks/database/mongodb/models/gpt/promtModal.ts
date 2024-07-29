import mongoose, { Schema } from "mongoose";

const PromptSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "GptChatGroup",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    question: { type: String },
    answer: { type: String, default: null },
    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },

  },
  { timestamps: true }
);



export const Prompt = mongoose.model("Prompt", PromptSchema);

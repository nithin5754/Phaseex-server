




import mongoose, { Schema } from "mongoose";

const GptChatGroupSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    group_title: { type: String},

    promptArray: [{
      type: Schema.Types.ObjectId,
      ref: "Prompt",
    },],
  },
  { timestamps: true }
);



export const GptChatGroup = mongoose.model("GptChatGroup", GptChatGroupSchema);

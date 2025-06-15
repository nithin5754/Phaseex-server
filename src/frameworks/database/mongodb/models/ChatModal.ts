import mongoose, { Schema } from "mongoose";

const chatsSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

chatsSchema.index({ workspaceId: 1, members: 1 });

export const chats = mongoose.model("Chat", chatsSchema);

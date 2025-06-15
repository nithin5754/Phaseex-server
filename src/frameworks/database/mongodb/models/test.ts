
import mongoose, { Schema } from "mongoose";

// Message Schema (Separate collection for messages)
const messageSchema = new Schema(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true, // Index for efficient querying by chat
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderUsername: {
      type: String, // Denormalized for faster reads
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000, // Limit message length
    },
    type: {
      type: String,
      enum: ["text", "image", "file", "system"], // Support different message types
      default: "text",
    },
    metadata: {
      // For images/files: store URLs or additional info
      url: { type: String },
      fileType: { type: String },
      fileSize: { type: Number },
    },
    readBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        readAt: { type: Date, default: Date.now },
      },
    ],
    deletedAt: {
      type: Date, // Soft deletion
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt, updatedAt
  }
);

// Chat Schema (Metadata for group chats)
const chatSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true, // Index for workspace-based queries
    },
    name: {
      type: String,
      trim: true,
      maxlength: 100, // Optional chat name
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
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
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: "Message", // Reference to the latest message for quick access
    },
    deletedAt: {
      type: Date, // Soft deletion
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt, updatedAt
  }
);

// Indexes for performance
messageSchema.index({ chatId: 1, createdAt: -1 }); // For sorting messages by time
chatSchema.index({ workspaceId: 1, members: 1 }); // For member-based queries

// Pre-save middleware to ensure updatedAt is managed by timestamps
// No need for manual updatedAt handling since timestamps: true is used

// Models
export const Chat = mongoose.model("Chat", chatSchema);
export const Message = mongoose.model("Message", messageSchema);
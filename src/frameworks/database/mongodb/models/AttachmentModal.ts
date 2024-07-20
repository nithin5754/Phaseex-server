import mongoose, { Schema } from "mongoose";

const AttachmentSchema = new Schema(
  {
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
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },

    attachmentLists: [
      {
        name: { type: String },
        url: { type: String },
        description: { type: String },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

AttachmentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

AttachmentSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
  },
});

export const Attachment = mongoose.model("Attachment", AttachmentSchema);

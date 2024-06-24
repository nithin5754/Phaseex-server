import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema(
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
    priority_task: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "low",
    },
    status_task: {
      type: String,
      enum: ["to-do", "in progress", "complete"],
      default: "to-do",
    },

    task_title: { type: String, required: true },
    task_description: { type: String, required: true },
  
    task_activity: [{ type: String }],
    task_attachment: [{
      file_name:{ type: String },
      attachment:{type:String}
    }],
    task_collaborators: [
      {
        assigneeId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          default:"developer"
        },
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

TaskSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

TaskSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
  },
});

export const Task = mongoose.model("Task", TaskSchema);

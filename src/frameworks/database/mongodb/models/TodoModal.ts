import mongoose, { Schema } from "mongoose";

const TodoSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    listId: {
      type: Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    todo: {
      type: String,
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
     
    },

    todo_status: {
      type: String,
      enum: ["hidden", "in progress", "completed"],
      default: "in progress",
      required: true,
    },


  
    



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

TodoSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

TodoSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
  },
});

export const Todo = mongoose.model("Todo", TodoSchema);

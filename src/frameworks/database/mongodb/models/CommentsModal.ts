import mongoose, { Schema } from "mongoose";

const commentsSchema = new Schema(
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
    todoId:{
      type: Schema.Types.ObjectId,
      ref:'Todo'
    },
    parent:{
      type: Schema.Types.ObjectId,
      ref:'comments',
      default:null
    },
    children:[
      {
        type:Schema.Types.ObjectId,
        ref:'comments'
      }
    ],
    message: {
      type: String,
    },
    userId: {
      type: String,
    },


    likes:[
      {
        type: Schema.Types.ObjectId,
        ref: "like",
      }
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

commentsSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});



export const comments = mongoose.model("comments", commentsSchema);

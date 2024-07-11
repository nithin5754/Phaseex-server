


import mongoose, { Schema } from "mongoose";

const ActivitySchema = new Schema(
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

    comment:  [{ 
      to:{ type: String },
      message:{ type: String },
      date:{
        type: Date,
        default: Date.now,
      },
     }],
  
    activity: [{ 
      message:{ type: String },
      date:{
        type: Date,
        default: Date.now,
      },
     }],

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

ActivitySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

ActivitySchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
  },
});

export const Activity = mongoose.model("Activity", ActivitySchema);

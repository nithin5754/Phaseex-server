

import mongoose, {Schema} from 'mongoose';

const WorkspaceSchema = new Schema(
  {
    workspaceOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",

    },
    title: { type: String, required: true },
    workspace_description:{ type: String, required: true },
    collaborators: [{
      assignee: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      role: {
        type: String
      }
    }],
    workspaceType: {
      type: String,
      enum: ["private", "shared"],
      default: "private",
    
    },
    createdAt: {
              type: Date,
              default: Date.now,
          },
          updatedAt: {
              type: Date,
              default: Date.now
          }
  },
  { timestamps: true }
);





WorkspaceSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

WorkspaceSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
    },
});




export const Workspace =mongoose.model("Workspace", WorkspaceSchema);

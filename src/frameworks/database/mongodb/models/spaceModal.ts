

import mongoose, { Document, Schema, Types } from 'mongoose';

interface Owner {
  _id: Types.ObjectId;
 
}
interface Collaborator  {
  assignee:Types.ObjectId; 
  role: string;
 
}

export interface WorkSpaceDocument extends Document {
    workspace_name:string;
    workspace_description:string
    workSpace_owner:Owner;
    workspace_collaborators:Collaborator[];
    createdAt: Date;
    updatedAt: Date;
}

const WorkSpaceSchema: Schema<WorkSpaceDocument> = new mongoose.Schema({
  workspace_name: {
    type: String,
  
  },
  workspace_description: {
    type: String,

  },
  workSpace_owner: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User',
 
  },
  workspace_collaborators: [{
    assignee: {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'User' 
    },
    role: {
      type: String,
      required: true
    }
  }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});


WorkSpaceSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

WorkSpaceSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
    },
});

const WorkSpace = mongoose.model<WorkSpaceDocument>('WorkSpace', WorkSpaceSchema);

export default WorkSpace;

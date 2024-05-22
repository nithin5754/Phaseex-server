



import mongoose, {Schema} from 'mongoose';

const FolderSchema = new Schema(
  {
   workspaceId:{
      type: Schema.Types.ObjectId,
      ref: "Workspace",  
    },
    folder_title: { type: String ,required: true },
    folder_description:{ type: String ,required: true },
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





FolderSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

FolderSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
    },
});




export const Folder =mongoose.model("Folder", FolderSchema);

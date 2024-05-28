






import mongoose, {Schema} from 'mongoose';

const ListSchema = new Schema(
  {
   workspaceId:{
      type: Schema.Types.ObjectId,
      ref: "Workspace",  
    },
    folderId:{
      type: Schema.Types.ObjectId,
      ref: "Folder",  
    },
    priority_list: {
      type: String,
      enum: ["high", "medium","low"],
      default: "low",
    
    },
    list_start_date: { type: String  },
    list_due_date: { type: String  },
    list_title: { type: String  },
    list_description:{ type: String },
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





ListSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

ListSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
    },
});




export const List =mongoose.model("List", ListSchema);










import mongoose, {Schema} from 'mongoose';

const CallNotificationSchema = new Schema(
  {
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
  
      },

      workspaceId: {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
      },
      ownerName: {
      type: String,

    },

    url:{
        type: String,

      },
      type: {
        type: String,
        enum: ["video", "chat"],
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




CallNotificationSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

CallNotificationSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
    },
});




export const CallNotification =mongoose.model("CallNotification", CallNotificationSchema);








import mongoose, {Schema} from 'mongoose';

const NotificationSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",

    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",

    },
    priority: { type: String,
      enum: ["high", "medium", "low"],
      default:"low"
     },
    link: { type:String}, 
    title: { type: String, require: true },
    type: { type: String },
    text: { type: String, require: true },
    read: { type: Boolean, default: false },
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




NotificationSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

NotificationSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
    },
});




export const Notification =mongoose.model("Notification", NotificationSchema);

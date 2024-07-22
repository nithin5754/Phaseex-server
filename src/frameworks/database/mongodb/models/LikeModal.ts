import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
   
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    commentId:{
      type: Schema.Types.ObjectId,
      ref: "comments",
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

likeSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

likeSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
  },
});

export const like = mongoose.model("like", likeSchema);

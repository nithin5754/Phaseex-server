

import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
    verified:boolean
   userName: string;
    email: string;
    profile_image: string;
    roles:string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<UserDocument> = new mongoose.Schema({
   verified: {
        type: Boolean,
        default:false
        
    },
    email: {
        type: String,
        required: true,
      
    },
    profile_image: {
        type: String,
        default:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freeiconspng.com%2Fimages%2Fprofile-icon-png&psig=AOvVaw2KkxnpaXU0MTaVhlbHsRdT&ust=1684305011140000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCOCJ46Kb-f4CFQAAAAAdAAAAABAJ',
    },
    password: {
        type: String,
        
    },
    roles: {
        type:String,
        default:'developer'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});


UserSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

UserSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
    },
});

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;

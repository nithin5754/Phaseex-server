




import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
    verified:boolean
   userName: string;
    email: string;
    profile_image: string;
    roles:string;
    password: string;
    otp:string;
    createdAt: Date;
    updatedAt: Date;

    verify_token:string,
    forgotPassWord_verified?:boolean
}

const TempUserSchemaModal: Schema<UserDocument> = new mongoose.Schema({
   verified: {
        type: Boolean,
        default:false
        
    },
    forgotPassWord_verified: {
        type: Boolean,
        default:false
        
    },

    otp: {
        type: String,
      
        
    },
    userName: {
        type: String,
      
    },
    email: {
        type: String,
      
    },
    profile_image: {
        type: String,
        default:
            'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freeiconspng.com%2Fimages%2Fprofile-icon-png&psig=AOvVaw2KkxnpaXU0MTaVhlbHsRdT&ust=1684305011140000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCOCJ46Kb-f4CFQAAAAAdAAAAABAJ',
    },
    password: {
        type: String,
      
    },
    verify_token: {
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


TempUserSchemaModal.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});



TempUserSchemaModal.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
    },
});

const TempUserModal = mongoose.model<UserDocument>('TempUserModal', TempUserSchemaModal);

export default TempUserModal;

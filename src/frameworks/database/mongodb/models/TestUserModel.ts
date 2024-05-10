



import mongoose, { Document, Schema } from 'mongoose';

export interface TestUserDocument extends Document {

   username: string;
    roles:string[];
    password: string;
  active:boolean
   
}

const TestUserSchema: Schema<TestUserDocument> = new mongoose.Schema({
  username: {
    type: String,
    required: true
},
password: {
    type: String,
    required: true
},
roles: [{
    type: String,
    default: "Employee"
}],
active: {
    type: Boolean,
    default: true
}
});




const TestUser = mongoose.model<TestUserDocument>('TestUser', TestUserSchema);

export default TestUser;



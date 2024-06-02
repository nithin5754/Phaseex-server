


export interface User {
     _id?:string,
     userName:string,
     email:string,
     password:string,
     profile_image?:string,
     roles:string,
     verified?:boolean,
     otp?:string
     verify_token?: string;
     expires?:Date ,
     forgotPassWord_verified?:boolean
     createdAt?:Date,
     updatedAt?:Date
     
}




export interface UserType {
     id:string,
     userName:string,
     email:string,
     profile_image?:string,
     roles:string,
     verified:boolean,
     createdAt:Date,
     updatedAt:Date
     
}





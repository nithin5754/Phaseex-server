


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
     
}



// export interface TempUserType   {
//      verified?:boolean
//      userName?: string;
//       email: string;
//       profile_image?: string;
//       roles?:string;
//       password?: string;
//       otp:string;
//       expires?:Date;
//       verify_token:string
// }
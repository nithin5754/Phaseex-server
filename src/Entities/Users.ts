


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
}
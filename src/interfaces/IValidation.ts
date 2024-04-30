


export  interface IValidation{

   checkEmail(email:string):boolean
   checkPassword(password:string):boolean
   isPassWordMatch(password:string,confirm_password:string):boolean

}
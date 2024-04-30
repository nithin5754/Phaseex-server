import { IValidation } from "../../Interfaces/IValidation";


export class Validation implements IValidation {
  isPassWordMatch(password: string, confirm_password: string): boolean {
    if(password!==confirm_password){
      return false
    }
 return true
 
  }
  private _emailRegex: RegExp =/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  ;
  private _passwordRegex: RegExp =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  checkPassword(password: string): boolean {
    let check: boolean = this._passwordRegex.test(password);
    return check;
  }
  checkEmail(email: string):boolean {
    let check: boolean = this._emailRegex.test(email);
    
    return check
     
  }
}



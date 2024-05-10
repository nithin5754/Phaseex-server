import { User } from "../Entities/Users";




export interface IAuthRepository {

    registerTempUser(data:User):Promise<User>
    findByEmail(email:string):Promise<User|null>
    findByEmailFromTemp(email:string):Promise<User|null>
    findEmailFromTokenId(tokenId:string):Promise<User|null>

    findEmailAndChangePassword(email:string,hashedNewPassword:string):Promise<boolean>
    resendToOtp(otp:string,email:string):Promise<boolean>

    verifyOtp(otp:string,email:string):Promise<boolean>
    createUser(userData:User):Promise<User>
    findById(id:string):Promise<User|null>
    deleteTempUser(email:string):Promise<boolean>
    forgotPassWordVerified(userData:User):Promise<boolean>
    
}


export default IAuthRepository
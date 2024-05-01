import { User } from "../Entities/Users";




export interface IAuthRepository {

    registerTempUser(data:User):Promise<User>
    findByEmail(email:string):Promise<User|null>
    findByEmailFromTemp(email:string):Promise<User|null>
    verifyOtp(otp:string,email:string):Promise<boolean>
    createUser(userData:User):Promise<User>
    findById(id:string):Promise<User|null>
    
}


export default IAuthRepository
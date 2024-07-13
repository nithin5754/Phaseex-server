import { User } from "../Entities/Users";



export interface IGoogleService {

  googleAuthentication(token:string):Promise<User|null>
}
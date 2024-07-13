import { User } from "../Entities/Users";
import IAuthRepository from "../Interfaces/IAuthRepository";
import { IGoogleService } from "../Interfaces/IGoogleService";
import { OAuth2Client, TokenPayload } from "google-auth-library";


export class GoogleService implements IGoogleService {


  private authRepository: IAuthRepository;



  constructor(
    authRepository: IAuthRepository,
 
   
  ) {
   this.authRepository=authRepository
  
 
  }


 async googleAuthentication(token: string): Promise<User|null> {
 const CLIENT_ID=process.env.GOOGLEOAUTH_CLIENT_ID;
   const CLIENT_SECRET = process.env.GOOGLEOAUTH_CLIENT_SECRET;
  const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);


     // Verify the Google token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,
  });

  // Get the user's email from the verified token
  const { email, name, picture, email_verified } =
    ticket.getPayload() as TokenPayload;


    if (!email || !name || !picture || !email_verified) {
  throw new Error("Google auth faild! User field undefined");
  
    }


    const existingUser = await this.authRepository.findByEmail(email);

     if(existingUser){
      return existingUser
     }else{
      const userData: User = {
        profile_image:picture,
        email:email,
        password:'',
        roles:'developer',
        userName:name,
        verified: true,
        
      };
      let isCreate=await this.authRepository.createUser(userData)

      if(isCreate){
        return isCreate
      }
     }





return null



  }


   
       
}
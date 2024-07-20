

import jwt from 'jsonwebtoken'

import {  IToken} from "../Interfaces/IToken";
import config from '../config';
import { workspaceSpaceJwtType } from '../Entities/WorkspaceDataType';


export interface TokenGenerateProps {
  userId:string;
  roles:string
}

export class Token implements IToken{

  private readonly jwt_key:string=config.jwt.JWT_SECRET||''
  private readonly refresh_secret:string=config.jwt.JWT_REFRESH_TOKEN||''


  accessTokenGenerator(userId:string,roles:string,spaces:workspaceSpaceJwtType[]|null): string {
    
    if(!spaces){
      const accessToken = jwt.sign( {userId,roles},this.jwt_key, {
        expiresIn:'1d' 
    });
  
    return accessToken;
    }

    const accessToken = jwt.sign( {userId,roles,spaces},this.jwt_key, {
      expiresIn:'1d' 
  });

  return accessToken;
     

  }

  generateTokens(userId:string,roles:string,spaces:workspaceSpaceJwtType[]|null): { accessToken: string; refreshToken: string; } {

    if(!spaces){
      const accessToken=jwt.sign({userId,roles},this.jwt_key,{
        expiresIn:'1d'
      })
      const refreshToken=jwt.sign({userId},this.refresh_secret,{
        expiresIn:'7d'
      })
  
      return{
        accessToken,refreshToken
      }
    }
    const accessToken=jwt.sign({userId,roles,spaces},this.jwt_key,{
      expiresIn:'1d'
    })
    const refreshToken=jwt.sign({userId},this.refresh_secret,{
      expiresIn:'7d'
    })

    return{
      accessToken,refreshToken
    }
    
  }
  verifyAccessToken(token: string) {
   
    
    return jwt.verify(token,this.jwt_key)
  }
  verifyRefreshToken(token: string) {
    return jwt.verify(token,this.refresh_secret)
  }
  
}
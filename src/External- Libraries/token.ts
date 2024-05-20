

import jwt from 'jsonwebtoken'

import {  IToken} from "../Interfaces/IToken";
import config from '../config';


export interface TokenGenerateProps {
  userId:string;
  roles:string
}

export class Token implements IToken{

  private readonly jwt_key:string=config.jwt.JWT_SECRET||''
  private readonly refresh_secret:string=config.jwt.JWT_REFRESH_TOKEN||''


  accessTokenGenerator(userId:string): string {
    const accessToken = jwt.sign( {userId},this.jwt_key, {
      expiresIn:'1m' 
  });

  return accessToken;
  }

  generateTokens(userId:string): { accessToken: string; refreshToken: string; } {

    const accessToken=jwt.sign({userId},this.jwt_key,{
      expiresIn:'1m'
    })
    const refreshToken=jwt.sign({userId},this.refresh_secret,{
      expiresIn:'1d'
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
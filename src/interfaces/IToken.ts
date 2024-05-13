


export interface IToken {

  generateTokens(userId:string,roles:string[]):{
    accessToken:string;
    refreshToken:string
  };
  verifyAccessToken(token:string):any
  verifyRefreshToken(token:string):any
  accessTokenGenerator(userId:string):string
}



// roles: {
//   type: [String],
//   default: ["Employee"]
// },
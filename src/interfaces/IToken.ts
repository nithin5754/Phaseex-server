// import { TokenGenerateProps } from "../External- Libraries/token";

import { workspaceSpaceJwtType } from "../Entities/WorkspaceDataType";



export interface IToken {

  generateTokens(userId:string,roles:string,spaces:workspaceSpaceJwtType[]|null):{
    accessToken:string;
    refreshToken:string
  };
  verifyAccessToken(token:string):any
  verifyRefreshToken(token:string):any
  accessTokenGenerator(userId:string,roles:string,spaces:workspaceSpaceJwtType[]|null):string
}



// roles: {
//   type: [String],
//   default: ["Employee"]
// },
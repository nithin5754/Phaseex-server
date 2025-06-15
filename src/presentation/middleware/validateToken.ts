import { NextFunction, Request, Response } from "express";

import { Token } from "../../External- Libraries/token";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const tokenClass = new Token();

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
     


  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorized token string" });
  }

  const token = authHeader.split(" ")[1];

  let decodedToken = tokenClass.verifyAccessToken(token);


  if (typeof decodedToken !== "string" && decodedToken.userId) {
    req.userId = decodedToken.userId;
    // console.log("is verified");

    next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
};

import { NextFunction, Request, Response } from "express";

export class HomeController {
  // @testing

  testing = async (req: Request, res: Response, next: NextFunction) => {
    try {
 

      return res
        .status(200)
        .json({
          message: "welcome home",
          result: ["nithin", "nivin", "joji", "nelvin", "sindu"],
        });
    } catch (error) {
      next(error);
    }
  };
}

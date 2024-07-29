import { NextFunction, Request, Response } from "express";
import { ICloudinaryStorage } from "../../interfaces/ICloudinaryStorage";
import { IMulterConverter } from "../../interfaces/IMulterConverter";


export class UploadController {
  private ICloudinary: ICloudinaryStorage;
  private multerConverter: IMulterConverter;

  constructor(
    ICloudinary: ICloudinaryStorage,
    multerConverter: IMulterConverter,
 
  ) {
    this.ICloudinary = ICloudinary;
    this.multerConverter = multerConverter;
   
  }

  onUploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again later" });
      }

      let dataURI = this.multerConverter.convertFileToString(file);

      const isUploaded = await this.ICloudinary.uploadPhoto(dataURI);
      if (!isUploaded) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again" });
      }

      return res.status(200).json(isUploaded.url);
    } catch (error) {
      next(error);
    }
  };
}

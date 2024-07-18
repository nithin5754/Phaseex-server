import { ICloudinaryStorage } from "../Interfaces/ICloudinaryStorage";
import cloudinary from 'cloudinary'

export class CloudinaryStorage implements ICloudinaryStorage  {
 async uploadPhoto(imageUrl: string): Promise<cloudinary.UploadApiResponse|null> {
      let response=await cloudinary.v2.uploader.upload(imageUrl)

      if(!response){
        return null
      }

      return response
  }

}
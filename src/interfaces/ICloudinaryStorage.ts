import cloudinary from 'cloudinary'



export interface ICloudinaryStorage{

     uploadPhoto(imageUrl:string):Promise<cloudinary.UploadApiResponse|null>
}
import { User } from "../Entities/Users";
import IAuthRepository from "../interfaces/IAuthRepository";
import { IGoogleService } from "../interfaces/IGoogleService";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import cloudinary from "cloudinary";
import { ICloudinaryStorage } from "../interfaces/ICloudinaryStorage";

export class GoogleService implements IGoogleService {
  private authRepository: IAuthRepository;
  private ICloudinary: ICloudinaryStorage;

  constructor(
    authRepository: IAuthRepository,
    ICloudinary: ICloudinaryStorage
  ) {
    this.authRepository = authRepository;
    this.ICloudinary = ICloudinary;
  }

  async googleAuthentication(token: string): Promise<User | null> {
    const CLIENT_ID = process.env.GOOGLEOAUTH_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLEOAUTH_CLIENT_SECRET;
    const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const { email, name, picture, email_verified } =
      ticket.getPayload() as TokenPayload;

    if (!email || !name || !picture || !email_verified) {
      throw new Error("Google auth faild! User field undefined");
    }

    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      return existingUser;
    } else {
      const res = await this.ICloudinary.uploadPhoto(picture);

      if (!res) {
        return null;
      }

      let userData: User = {
        profile_image: res.url,
        email: email,
        password: "",
        roles: "developer",
        userName: name,
        verified: true,
      };
      let isCreate = await this.authRepository.createUser(userData);

      if (isCreate) {
        return isCreate;
      }
    }

    return null;
  }
}

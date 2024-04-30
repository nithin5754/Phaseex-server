
import { trusted } from "mongoose";
import config from "../config";
import { IMailer } from "../interfaces/IMailer";
import nodemailer from 'nodemailer'

export class Mailer implements IMailer{
    async SendEmail(name: string,email:string,otp:string) {
      console.log(name,email,otp)
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
      
          user:config.EMAIL_NODEMAILER,
          pass:"xuuv kkhf iegi sikf",
        },
      });


      let res = await transporter.sendMail({
        from: "nithinjoji0756@gmail.com",
        to: `${email}`,
        subject: "OTP for verification",
        html: `<h1>Hy ${name}</h1><br><p>Your OTP for the verification is <h2>${otp}</h2></p>`,
      });

      return true
      }

    } 
      







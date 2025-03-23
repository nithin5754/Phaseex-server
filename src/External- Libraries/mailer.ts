

import config from "../config";
import { IMailer } from "../interfaces/IMailer";
import nodemailer from 'nodemailer'

export class Mailer implements IMailer{
  async  SendVideoCallInvite(ownerName: string, email: string, url: string) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
      
          user:config.EMAIL_NODEMAILER,
          pass:config.PASSWORD_NODEMAILER,
        },
      });

     await transporter.sendMail({
        from: "nithinjoji0756@gmail.com",
        to: `${email}`,
        subject: "OTP for verification",
        html: `<h1>Hi, my name is ${ownerName}</h1>
        <br>
        <p>Inviting you to join <a href="${url}">${url}</a></p>
            <br>
              <h1>please join as soon as possible</h1>
        `,
      });
    }
    async SendEmail(name: string,email:string,otp:string) {
 
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
      
          user:config.EMAIL_NODEMAILER,
          pass:config.PASSWORD_NODEMAILER,
        },
      });

await transporter.sendMail({
        from: "nithinjoji0756@gmail.com",
        to: `${email}`,
        subject: "OTP for verification",
        html: `<h1>Hy ${name}</h1><br><p>Your OTP for the verification is <h2>${otp}</h2></p>`,
      });
      return true
      }
    } 
      







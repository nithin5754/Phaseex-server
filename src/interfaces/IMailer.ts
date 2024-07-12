


export interface IMailer {
  SendEmail(name: string,email:string,otp:string): any;
  SendVideoCallInvite(ownerName: string,email:string,url:string): any;
}
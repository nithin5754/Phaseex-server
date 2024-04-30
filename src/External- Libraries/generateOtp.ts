
import crypto from 'crypto';
import { IGenerateOtp } from '../Interfaces/IGenerateOtp';

export class GenerateOtp implements IGenerateOtp {
 private generatedOTPs = new Set<string>();

 createOtp(length: number):string {
    let otp: string;
    do {
      const maxValue = Math.pow(10, length) - 1;
      const randomOTP = crypto.randomInt(0, maxValue);
      otp = randomOTP.toString().padStart(length, '0');
    } while (this.generatedOTPs.has(otp));
    
    this.generatedOTPs.add(otp);
    return otp;
 }
}



import { IProgressBar } from "../Interfaces/IProgressBar";




   export class ProgressBar implements IProgressBar {
    constructor() {
      
    }
     calculateProgressBar(TComplete: number, total: number): number {
       
    let percentage:number=(TComplete/total)*100
    return percentage

     }


   }
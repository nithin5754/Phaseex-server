import moment from "moment";
import { IDueDate } from "../Interfaces/IDueDate";


export class DueDay implements IDueDate {
  constructor() {
    
  }
  useTimeDue(start_date: string, due_date: string): number {

    const start = moment(start_date, 'MMMM D, YYYY').toDate();
    const due= moment(due_date, 'MMMM D, YYYY').toDate();
    let Difference_In_Time:number =
    due.getTime() - start.getTime();


    let Difference_In_Days:number =
    Math.round
        (Difference_In_Time / (1000 * 3600 * 24));
    return Difference_In_Days
  }
}






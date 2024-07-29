import { StringExpressionOperatorReturningBoolean } from "mongoose";



export interface CreateGroupType {
  group_title:string;
  userId:string
 }


 export interface receivePromptQusType {
  userId:string;
  groupId:string;
  questionType:"text"|"image";
  question:string
 }





 export interface receivePromptAnsType {
  promptId:string
  userId:string;
  groupId:string;
  question:string
  answer:string
  
 }


 export interface  AllGroupType {
  id:string
  title:string;
  userId:string;
  
 }

 export interface PromptType {
  id:string
  question: string;
  questionType:"text"|"image";
  answer: string | null;

}


export interface TGetallPromptByGroup {
  groupId:string;
  userId:string
}


 export interface GptType{
  id:string;
  userId:string;
  group_title:string;
  promptArray:PromptType[]|[]
  
 }



 
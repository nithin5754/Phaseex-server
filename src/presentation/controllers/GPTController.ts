import { NextFunction, Request, Response } from "express";
import { IGptService } from "../../interfaces/IGptService";
import { receivePromptAnsType, receivePromptQusType } from "../../Entities/Gpt";

export class GPTController {
  private gptService: IGptService;
  constructor(gptService: IGptService) {
    this.gptService = gptService;
  }

  onCreateGPTgroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const group_title = req.body.group_title;

      console.log("hello");

      const userId = req.userId;

      console.log(req.body, "body", userId, "userId");

      if (
        !group_title ||
        typeof group_title !== "string" ||
        !userId ||
        typeof userId !== "string"
      ) {
        return res
          .status(404)
          .json({ message: "credential missing please try again later" });
      }

      let isCreated = await this.gptService.getAddGroup({
        group_title,
        userId,
      });

      if (!isCreated) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again" });
      }

      return res.status(200).json(isCreated);
    } catch (error) {
      next(error);
    }
  };

  onGetAllGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(404).json({ message: "credentials missing" });
      }

      let getALLGroup = await this.gptService.AllGroup(userId);

      if (!getALLGroup) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again " });
      }

      return res.status(200).json(getALLGroup);
    } catch (error) {
      next(error);
    }
  };

  onAddQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
 
      const { groupId, questionType, question } = req.body;
      const userId = req.userId;

      if (
        !groupId ||
        !userId ||
        typeof groupId !== "string" ||
        !question ||
        typeof question !== "string" ||
        !questionType
      ) {
        return res
          .status(404)
          .json({ message: "credential missing please try again later" });
      }

      let data: receivePromptQusType = {
        userId,
        groupId,
        questionType,
        question,
      };

      let addQuestions = await this.gptService.getAddQuestions(data);

      if(!addQuestions){
        return res.status(404).json({message:"something went wrong"})
      }

      return res.status(200).json(addQuestions)
    } catch (error) {
      next(error);
    }
  };


  onAddAnswer = async (req: Request, res: Response, next: NextFunction) => {


    try {
 
      const {promptId, groupId, question,answer } = req.body;
      const userId = req.userId;

      if (
        !groupId ||
        !userId ||
        typeof groupId !== "string" ||
        !question ||
        typeof question !== "string" ||
        !answer||typeof answer !== 'string'
      ) {
        return res
          .status(404)
          .json({ message: "credential missing please try again later" });
      }

      let data:receivePromptAnsType = {
        userId,
        promptId,
        groupId,
        answer,
        question,
      };

      let addQuestions = await this.gptService.getAddAnswers(data);

      if(!addQuestions){
        return res.status(404).json({message:"something went wrong"})
      }

      return res.status(200).json(addQuestions)
    } catch (error) {
      next(error);
    }
  };


  onGetAllPromptByGroupId= async (req: Request, res: Response, next: NextFunction) => {


    try {

      const groupId=req.params.groupId
      const userId=req.userId

      if(!groupId||!userId||typeof groupId !=='string'){
        return res
        .status(404)
        .json({ message: "credential missing please try again later" });
      }

      let getAllPrompt=await this.gptService.AllPromptByGroupId({groupId,userId})

      if(!getAllPrompt){
        return res.status(404).json({ message: "credential missing please try again later" });
      }

      return res.status(200).json(getAllPrompt)
      
    } catch (error) {
      next(error)
    }


  }

}

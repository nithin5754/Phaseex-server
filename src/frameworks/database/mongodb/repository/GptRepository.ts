import {
  receivePromptQusType,
  receivePromptAnsType,
  CreateGroupType,
  GptType,
  TGetallPromptByGroup,
  AllGroupType,
  PromptType,
} from "../../../../Entities/Gpt";
import { IGptRepository } from "../../../../interfaces/IGptRepository";

import { Prompt } from "../models/gpt/promtModal";
import { GptChatGroup } from "../models/gpt/GptGroupModal";
import mongoose from "mongoose";

export class GptRepository implements IGptRepository {
  constructor() {}

  async getAllGroup(userId: string): Promise<AllGroupType[] | null> {
    let response = await GptChatGroup.find({ userId }).sort({ createdAt: -1 });

    if (response && response.length > 0) {
      let responseData: AllGroupType[] = response.map((res) => ({
        id: res._id.toString() as string,
        title: res.group_title as string,
        userId: res.userId?.toString() as string,
      }));
      return responseData;
    }
    return null;
  }
  async getAllPromptByGroupId(
    data: TGetallPromptByGroup
  ): Promise<GptType | null> {
    const result = await GptChatGroup.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(data.groupId),
          userId: new mongoose.Types.ObjectId(data.userId),
        },
      },
      {
        $unwind: "$promptArray",
      },
      {
        $lookup: {
          from: "prompts",
          localField: "promptArray",
          foreignField: "_id",
          as: "promptsDetails",
        },
      },

      {
        $unwind: "$promptsDetails",
      },
    ]);

    if (result && result.length > 0) {
      let data: PromptType[] = result.map((res) => ({
        id: res.promptsDetails._id.toString() as string,
        answer: res.promptsDetails.answer,
        question: res.promptsDetails.question,
        questionType: res.promptsDetails.questionType,
      }));

      let resData: GptType = {
        id: result[0]._id.toString() as string,
        group_title: result[0].group_title,
        userId: result[0].userId,
        promptArray: data,
      };

      console.log(resData, "hello promts");

      return resData;
    }

    return null;
  }

  async addGroup(data: CreateGroupType): Promise<AllGroupType | null> {
    let response = await GptChatGroup.create(data);

    if (response) {
      let responseData: AllGroupType = {
        id: response._id.toString() as string,
        userId: response.userId?.toString() as string,
        title: response.group_title as string,
      };

      return responseData;
    }

    return null;
  }
  async addQuestions(
    data: receivePromptQusType
  ): Promise<{ promptId: string } | null> {
    let isCreated = await Prompt.create(data);

    if (isCreated) {
      let updateGrp = await GptChatGroup.findOneAndUpdate(
        { _id: data.groupId, userId: data.userId },
        { $push: { promptArray: isCreated._id } },
        { new: true }
      );

      if (updateGrp) {
        return { promptId: isCreated._id.toString() as string };
      } else {
        return null;
      }
    }

    return null;
  }
  async addAnswers(data: receivePromptAnsType): Promise<boolean> {
    let updatePrompt = await Prompt.findOneAndUpdate(
      { _id: data.promptId },
      { answer: data.answer },
      { new: true }
    );

    return !!updatePrompt;
  }
}

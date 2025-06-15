import { NextFunction, Request, Response } from "express";
import { IChatService } from "../../interfaces/IChatService";

export class ChatController {
  constructor(private readonly chatService: IChatService) {}

  createChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { workspaceId, members } = req.body;
      const creatorId = req.userId;
      const chat = await this.chatService.createChat(
        { workspaceId, members },
        creatorId
      );
      if (chat) {
        return res
          .status(200)
          .json({ message: "success fully chat group created", data: chat });
      }

      return res.status(403).json({
        message: "something went wrong ! please try again after sometime",
      });
    } catch (error) {
      next(error);
    }
  };
}

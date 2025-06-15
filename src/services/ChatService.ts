import {
  ICreateChatPayload,
  IChat,
  ICreateMessagePayload,
  IMessage,
} from "../Entities/chat-message";
import IChatRepository from "../interfaces/IChatRepositroy";
import { IChatService } from "../interfaces/IChatService";

export class ChatService implements IChatService {
  constructor(private readonly chatRepo: IChatRepository) {}
  async createChat(
    data: ICreateChatPayload,
    creatorId: string
  ): Promise<IChat | null> {
    const result: IChat | null = await this.chatRepo.createChat(
      data,
      creatorId
    );

    return result;
  }
  createMessage(data: ICreateMessagePayload): Promise<IMessage | null> {
    throw new Error("Method not implemented.");
  }
}

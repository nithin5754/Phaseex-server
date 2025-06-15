import {
  ICreateChatPayload,
  IChat,
  ICreateMessagePayload,
  IMessage,
  IMember,
} from "../../../../Entities/chat-message";
import IChatRepository from "../../../../interfaces/IChatRepositroy";
import { chats } from "../models/ChatModal";

export class ChatRepository implements IChatRepository {
  private chatConvert(chat: any): IChat {
    return {
      id: chat._id.toString(),
      workspaceId: chat.workspaceId.toString(),
      members: chat.members.map((member: any) => ({
        userId: member.userId.toString(),
        role: member.role,
        joinedAt: member.joinedAt,
      })),
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }
  async createChat(
    data: ICreateChatPayload,
    creatorId: string
  ): Promise<IChat | null> {
    const result = await chats.create({
      ...data,
      members: [...data.members, { userId: creatorId, role: "admin" }],
    });

    if (result) {
      return this.chatConvert(result);
    }

    return null;
  }

    

  createMessage(data: ICreateMessagePayload): Promise<IMessage> {
    throw new Error("Method not implemented.");
  }


}

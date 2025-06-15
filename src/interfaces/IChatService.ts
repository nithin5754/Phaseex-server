import { IChat, ICreateChatPayload, ICreateMessagePayload, IMessage } from "../Entities/chat-message";


export interface IChatService {

    createChat(data: ICreateChatPayload,creatorId:string): Promise<IChat|null>;
  createMessage(data: ICreateMessagePayload): Promise<IMessage|null>;
}
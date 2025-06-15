interface IMember {
  userId: string;
  role: "admin" | "member";
  joinedAt: Date;
}

interface IChat {
  id: string;
  workspaceId: string;
  members: IMember[];
  createdAt: Date;
  updatedAt: Date;
}

interface ReadBy {
  userId: string;
  readAt: Date;
}

interface IMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  type: "text" | "image" | "file" | "system";
  readBy: ReadBy[];
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type ICreateChatPayload = Omit<IChat, "id" | "createdAt" | "updatedAt">;

type ICreateMessagePayload = Omit<
  IMessage,
  "createdAt" | "updatedAt" | "id" | "deletedAt"
>;

export { IChat, IMessage, ICreateChatPayload, ICreateMessagePayload ,IMember};

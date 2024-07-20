


export interface Attachment {
  id:string
  name: string;
  description:string;
  url: string;
}

export interface AttachmentSliceType {
  id:string;
  workspaceId:string;
  folderId:string;
  listId:string;
  taskId:string;
  attachmentLists: Attachment[];
}



/**
 * @desc creating attachment type
 */

export interface SendAttachmentDetails {
  name: string;
  description:string;
  url: string;
};

export interface SendAttachment {
  workspaceId:string;
  folderId:string;
  listId:string;
  taskId:string;
  attachment:SendAttachmentDetails

}
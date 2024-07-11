

export interface ResponseActivityArray {
  
  id:string;
  message:string;
  date:string


}

export interface ResponseActivityModal {
id:string;
workspaceId:string;
folderId:string;
listId:string;
taskId:string;
activity:ResponseActivityArray[]
}




export interface CActivityType {
  workspaceId: string;
  folderId: string;
  listId: string;
  taskId: string;
  activity: ActivityType;
}

// comment:  [{ 
//   to:{ type: String },
//   message:{ type: String }
//  }],


export interface CommentType {
  to:string;
  message:string
}

export interface ActivityType {
  message:string
}

export interface CCommentType {
  workspaceId: string;
  folderId: string;
  listId: string;
  taskId: string;
  comment: CommentType;
}




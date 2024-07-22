




export interface CreateTopComment{
   
  workspaceId:string;
  folderId:string;
  listId:string;
  taskId:string;
  todoId:string;
  message:string;
  userId:string
}


export interface SendGetAllComment {
   
  workspaceId:string;
  folderId:string;
  listId:string;
  taskId:string;
  todoId:string;
  
}



export interface CommentList {
  id:string;
  workspaceId:string;
  folderId:string;
  listId:string;
  taskId:string;
  todoId:string;
  message:string;
  userId:string;
  parent:string|null;
  children:CommentList[]|[]
  createdAt:string;
  updatedAt:string; 
}


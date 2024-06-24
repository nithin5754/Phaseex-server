

export interface ListDataType {
  id:string
  list_title:string,
  list_description:string,
  workspaceId:string,
  progressTask:number
  priority_list:string
  list_collaborators:ListCollaboratorType[];
  list_start_date:string,
  list_due_date:string,
  folderId:string,
  createdAt:string,
  updatedAt:string
}



export interface ListCollaboratorType {
  assignee: string; 
  role:"listManager"|"spaceOwner"|"viewer";
}


export interface ListCollaboratorDetailType {
  id:string;
  fullName: string; 
  email:string;
  imageUrl:string;
  role:"listManager"|"spaceOwner"|"viewer";
}


export interface listCollabRole {
  role:"listManager"|"spaceOwner"|"viewer";
}











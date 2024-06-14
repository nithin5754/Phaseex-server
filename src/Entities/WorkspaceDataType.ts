
export interface CollaboratorType {
  assignee: string; 
  role: string;
}


export interface WorkspaceDataType {
  id:string
  workspaceOwner: string; 
  title: string;
  workspace_description:string
  collaborators:CollaboratorType[]; 
  workspaceType: string;
  active:boolean;
  createdAt:Date,
  updatedAt:Date
}




export interface workspaceSpaceJwtType{
  id:string
  role:"member"|"owner"|"listManager"
}
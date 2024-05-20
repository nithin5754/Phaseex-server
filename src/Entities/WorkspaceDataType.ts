
export interface CollaboratorType {
  assigneeId: string; 
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
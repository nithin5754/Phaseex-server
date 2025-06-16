import { Role } from "../presentation/utils/rolesPermission";

export interface CollaboratorType {
  assignee: string; 
  role: Role;
  verified:boolean
}



export interface getCollaboratorType {
  assignee: string; 
  role: string;
  id:string;
verified:boolean
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
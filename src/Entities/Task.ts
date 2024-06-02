
export interface TaskAttachmentType {
  file_name:string;
  attachment:string
}


export interface TaskCollaboratorType {
  assigneeId: string; 
  role: string;
}


export interface TaskType {
  id:string;
  task_title:string,
  workspaceId:string;
  folderId:string;
  listId:string;
  priority_task:string;
  status_task:string;
  task_description:string;

  task_activity:Array<string>;
  task_attachment:TaskAttachmentType[];
  task_collaborators:TaskCollaboratorType[];
  createdAt:string,
  updatedAt:string

}
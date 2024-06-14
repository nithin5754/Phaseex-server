

export interface TodoType {
  id:string;
  workspaceId:string;
  folderId:string;
  listId:string;
  taskId:string
  todo:string;
  assignee:string;
  todo_status:"in progress"|"completed"|"hidden";
  createdAt:string,
  updatedAt:string
}
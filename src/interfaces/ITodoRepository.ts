import { TodoCollabTypeDetails, TodoType } from "../Entities/Todo";
import { STaskCollabType } from "../frameworks/database/mongodb/repository/searchRepository";

export interface ITodoRepository {
  allTodoTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string
  ): Promise<TodoType[] | null>;

  createTodoTask(todoTaskData: Partial<TodoType>): Promise<TodoType | null>;

  updateStatus(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string,
    todo_status: string
  ): Promise<boolean>;

  updateTodoTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string,
    todo: string
  ): Promise<boolean>;

  checkDuplicateTodo(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todo: string
  ): Promise<boolean>;

  deleteTodoTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string
  ): Promise<boolean>;

  deleteTodoWithWorkspace(workspaceId:string):Promise<boolean>

  addCollabToTodo(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string,
    collabId: string
  ): Promise<boolean>;

  collabTodoByTodoId(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string
  ): Promise<TodoCollabTypeDetails[]|null>;


  deleteCollabTodo(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string,
    collabId: string
  ): Promise<boolean>;

  deleteCollabFromAllTodo(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,

    collabId: string
  ): Promise<boolean>;



 



}

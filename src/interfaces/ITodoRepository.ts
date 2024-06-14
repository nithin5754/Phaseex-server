import { TodoType } from "../Entities/Todo";

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

  deleteTodoTask(   workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string):Promise<boolean>
}

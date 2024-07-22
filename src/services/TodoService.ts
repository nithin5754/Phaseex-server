import { TodoCollabTypeDetails, TodoType } from "../Entities/Todo";
import { ITodoRepository } from "../interfaces/ITodoRepository";
import { ITodoService } from "../interfaces/ITodoService";

export class TodoService implements ITodoService {
  private todoRepository: ITodoRepository;
  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }
 async getDeleteTodoWithWorkspace(workspaceId: string): Promise<boolean> {
    let response=await this.todoRepository.deleteTodoWithWorkspace(workspaceId)

    return response

  }
 async getDeleteCollabTodo(workspaceId: string, folderId: string, listId: string, taskId: string, todoId: string, collabId: string): Promise<boolean> {
   let response=await this.todoRepository.deleteCollabTodo(workspaceId,folderId,listId,taskId,todoId,collabId)

   return response
  }
  async getCollabTodoByTodoId(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string
  ): Promise<TodoCollabTypeDetails[] | null> {
    let response = await this.todoRepository.collabTodoByTodoId(
      workspaceId,
      folderId,
      listId,
      taskId,
      todoId
    );
    if (!response) {
      return null;
    }
    return response;
  }

  async getAddCollabToTodo(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string,
    collabId: string
  ): Promise<boolean> {
    let response = await this.todoRepository.addCollabToTodo(
      workspaceId,
      folderId,
      listId,
      taskId,
      todoId,
      collabId
    );

    return response;
  }
  async getDeleteTodoTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string
  ): Promise<boolean> {
    let response = await this.todoRepository.deleteTodoTask(
      workspaceId,
      folderId,
      listId,
      taskId,
      todoId
    );

    return response;
  }
  async getCheckDuplicateTodo(todoData: Partial<TodoType>): Promise<boolean> {
    if (
      !todoData.workspaceId ||
      !todoData.folderId ||
      !todoData.listId ||
      !todoData.taskId ||
      !todoData.todo
    ) {
      return false;
    }

    let workspaceId: string = todoData.workspaceId;
    let folderId: string = todoData.folderId;
    let listId: string = todoData.listId;
    let taskId: string = todoData.taskId;
    let todo: string = todoData.todo;

    let response = await this.todoRepository.checkDuplicateTodo(
      workspaceId,
      folderId,
      listId,
      taskId,
      todo
    );

    return response;
  }
  async getUpdateTodoTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string,
    todo: string
  ): Promise<boolean> {
    let response = await this.todoRepository.updateTodoTask(
      workspaceId,
      folderId,
      listId,
      taskId,
      todoId,
      todo
    );

    return response;
  }
  async getUpdateStatus(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoId: string,
    todo_status: string
  ): Promise<boolean> {
    let response = await this.todoRepository.updateStatus(
      workspaceId,
      folderId,
      listId,
      taskId,
      todoId,
      todo_status
    );

    return response;
  }
  async getCreateTodoTask(
    todoTaskData: Partial<TodoType>
  ): Promise<TodoType | null> {
    let response = await this.todoRepository.createTodoTask(todoTaskData);
    if (response) {
      return response;
    }
    return null;
  }
  async getAllTodoTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string
  ): Promise<TodoType[] | null> {
    let response = await this.todoRepository.allTodoTask(
      workspaceId,
      folderId,
      listId,
      taskId
    );

    if (response) {
      return response;
    }

    return null;
  }
}

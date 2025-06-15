import { ListDataType } from "../Entities/List";
import { TaskCollaboratorDetailType, TaskType } from "../Entities/Task";
import { IDueDate } from "../interfaces/IDueDate";
import { IListRepository } from "../interfaces/IListRepository";
import { IProgressBar } from "../interfaces/IProgressBar";
import { ITaskRepository } from "../interfaces/ITaskRepository";
import { ITaskService } from "../interfaces/ITaskService";
import { ITodoRepository } from "../interfaces/ITodoRepository";

export class TaskService implements ITaskService {
  private taskRepository: ITaskRepository;
  private listRepository: IListRepository;
  private todoRepository: ITodoRepository;
  private dueDate: IDueDate;
  private progressBar: IProgressBar;
  constructor(
    taskRepository: ITaskRepository,
    listRepository: IListRepository,
    dueDate: IDueDate,
    progressBar: IProgressBar,
    todoRepository: ITodoRepository
  ) {
    this.taskRepository = taskRepository;
    this.listRepository = listRepository;
    this.dueDate = dueDate;
    this.progressBar = progressBar;
    this.todoRepository = todoRepository;
  }
  getDeleteTaskLink(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    linkId: string
  ): Promise<boolean> {
    return this.taskRepository.deleteTaskLink(
      workspaceId,
      folderId,
      listId,
      taskId,
      linkId
    );
  }
  addTaskLink(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    link: string,
    link_name: string
  ): Promise<boolean> {
    return this.taskRepository.taskLink(
      workspaceId,
      folderId,
      listId,
      taskId,
      link,
      link_name
    );
  }


  async getUpdateDescription(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    task_description: string
  ): Promise<boolean> {
    let response = await this.taskRepository.updateDescription(
      workspaceId,
      folderId,
      listId,
      taskId,
      task_description
    );

    return response;
  }
  async getSingleTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string
  ): Promise<TaskType | null> {
    let response = await this.taskRepository.singleTask(
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
  async getTaskStatusWiseCount(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<{ "to-do": number; in_progress: number; complete: number }> {
    let response = await this.taskRepository.TaskStatusWiseCount(
      workspaceId,
      folderId,
      listId
    );

    return response;
  }
  async getAllTaskCount(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<number> {
    let allTaskCount = await this.taskRepository.AllTaskCount(
      workspaceId,
      folderId,
      listId
    );

    return allTaskCount;
  }

  async getAllCompleteTask(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<number> {
    let allCompleteTask: number = await this.taskRepository.AllCompleteTask(
      workspaceId,
      folderId,
      listId
    );

    return allCompleteTask;
  }
  async getUpdateProgressTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    getAllCompleteTask: number,
    allTaskCount: number
  ): Promise<boolean> {
    let percentage = this.progressBar.calculateProgressBar(
      getAllCompleteTask,
      allTaskCount
    );

    if (percentage < 1) percentage = 0;

    let updateTaskWithProgress = await this.listRepository.updateProgressTask(
      workspaceId,
      folderId,
      listId,
      percentage
    );

    return !!updateTaskWithProgress;
  }
  async getUpdateStatus(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    status: string
  ): Promise<boolean> {
    let response = await this.taskRepository.updateStatus(
      workspaceId,
      folderId,
      listId,
      taskId,
      status
    );

    return response;
  }

  async getUpdatePriority(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    priority: string
  ): Promise<boolean> {
    let response = await this.taskRepository.updatePriority(
      workspaceId,
      folderId,
      listId,
      taskId,
      priority
    );

    return response;
  }
  async setTaskDateFromList(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<ListDataType | null> {
    let response = await this.listRepository.singleList(
      workspaceId,
      folderId,
      listId
    );

    if (!response) {
      return null;
    }

    return response;
  }
  async getAllTask(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<TaskType[] | null> {
    let response = await this.taskRepository.allTask(
      workspaceId,
      folderId,
      listId
    );
    if (response && response.length > 0) {
      return response;
    }
    return null;
  }
  async getDuplicateTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    task_name: string
  ): Promise<boolean> {
    let response = await this.taskRepository.findDuplicateTask(
      workspaceId,
      folderId,
      listId,
      task_name
    );
    return response;
  }
  async isExist(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<boolean | null> {
    let response = await this.listRepository.listExistById(
      workspaceId,
      folderId,
      listId
    );
    if (response) {
      return true;
    }
    return false;
  }
  async createTask(taskData: Partial<TaskType>): Promise<TaskType | null> {
    let response = await this.taskRepository.createTask(taskData);

    if (!response) {
      return null;
    }
    return response;
  }
}

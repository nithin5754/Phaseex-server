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
  addDevelopers(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    memberId: string
  ): Promise<boolean> {
    return this.taskRepository.addMDeveloperToTask(
      workspaceId,
      folderId,
      listId,
      taskId,
      memberId
    );
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
  const task = await this.taskRepository.singleTask(workspaceId, folderId, listId, taskId);
  const list = await this.listRepository.singleList(workspaceId, folderId, listId);

  if (!task) return null;

  task.task_collaborators ??= [];

  if (list?.list_collaborators) {
    const listManagers = list.list_collaborators.filter(
      (collab) => collab.role === "manager"
    );

    for (const manager of listManagers) {
      const index = task.task_collaborators.findIndex(
        (collab) => collab.assignee === manager.assignee && collab.role === "developer"
      );

      if (index !== -1) {
        await this.taskRepository.deleteTaskMember(
          workspaceId,
          folderId,
          listId,
          task.id,
          manager.assignee
        );
        task.task_collaborators.splice(index, 1);
      }
    }

    task.task_collaborators.push(...list.list_collaborators);
  }

  return task;
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
    const response = await this.taskRepository.allTask(
      workspaceId,
      folderId,
      listId
    );
    const singleListDetails: ListDataType | null =
      await this.listRepository.singleList(workspaceId, folderId, listId);

    if (singleListDetails?.list_collaborators && response) {
      response.forEach(async (task: TaskType) => {
        if (!task.task_collaborators) {
          task.task_collaborators = [];
        }

        const listMangers = singleListDetails.list_collaborators.filter(
          (listCollab) => listCollab.role === "manager"
        );

        for (const manager of listMangers) {
          const conflictDeveloper = task.task_collaborators.find(
            (collab) =>
              collab.assignee === manager.assignee &&
              collab.role === "developer"
          );

          if (conflictDeveloper) {
            await this.taskRepository.deleteTaskMember(
              workspaceId,
              folderId,
              listId,
              task.id,
              conflictDeveloper.assignee
            );

            task.task_collaborators = task.task_collaborators.filter(
              (collab) => collab.assignee !== conflictDeveloper.assignee
            );
          }
        }

        task.task_collaborators.push(...singleListDetails.list_collaborators);
      });
    }

    return response && response.length > 0 ? response : null;
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

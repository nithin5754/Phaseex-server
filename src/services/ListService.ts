import { response } from "express";
import {
  ListCollaboratorDetailType,
  ListDataType,
  listCollabRole,
} from "../Entities/List";
import {
  IListRepository,
  ListDataTypePage,
} from "../interfaces/IListRepository";
import { IListService } from "../interfaces/IListService";
import { ITaskRepository } from "../interfaces/ITaskRepository";
import { TaskType } from "../Entities/Task";

export class ListService implements IListService {
  private listRepository: IListRepository;
  private taskRepository:ITaskRepository
  constructor(listRepository: IListRepository,taskRepository:ITaskRepository) {
    this.listRepository = listRepository;
     this.taskRepository=taskRepository
  }
 async getDeleteList(workspaceId: string, folderId: string, listId: string): Promise<boolean> {
    
       let response=await this.listRepository.deleteList(workspaceId,folderId,listId)
       return !!response
  }


  async checkCollabIsExistInTasks(workspaceId: string, folderId: string, listId: string, collaboratorId: string): Promise<boolean> {
     
    let response=await this.taskRepository.checkCollaboratorInTasks(workspaceId,folderId,listId,collaboratorId)

    return response
  }

  async getDeleteListCollabByListId(workspaceId: string, folderId: string, listId: string, collabId: string): Promise<boolean> {

    let response=await this.listRepository.deleteListCollabByListId(workspaceId,folderId,listId,collabId)
  return response
  }
  async getUpdateListCollabByListId(
    workspaceId: string,
    folderId: string,
    listId: string,
    collabId: string,
    role: listCollabRole
  ): Promise<boolean> {
    let response = await this.listRepository.updateListCollabByListId(
      workspaceId,
      folderId,
      listId,
      collabId,
      role
    );

    return !!response;
  }
  async getListCollabByListId(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<ListCollaboratorDetailType[] | null> {
    const userRoles: {
      [index: string]: "listManager" | "spaceOwner" | "viewer";
    } = {};
    let response = await this.listRepository.listCollabByListId(
      workspaceId,
      folderId,
      listId
    );
    let singleList = await this.listRepository.singleList(
      workspaceId,
      folderId,
      listId
    );

    if (response && singleList) {
      singleList.list_collaborators.forEach((user) => {
        userRoles[user.assignee] = user.role;
      });

      response.forEach((user) => {
        user.role = userRoles[user.id];
      });

      return response;
    }

    return null;
  }
  async getAddCollabToList(
    workspaceId: string,
    folderId: string,
    listId: string,
    collabId: string
  ): Promise<boolean> {
    let response = await this.listRepository.addCollabToList(
      workspaceId,
      folderId,
      listId,
      collabId
    );

    return response;
  }
  async getSingleList(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<ListDataType | null> {
    let response = await this.listRepository.singleList(
      workspaceId,
      folderId,
      listId
    );

    if (response) {
      return response;
    }

    return null;
  }
  async getUpdateListDate(
    workspaceId: string,
    folderId: string,
    listId: string,
    list_start_date: string,
    list_due_date: string
  ): Promise<boolean> {
    let response = await this.listRepository.updateListDate(
      workspaceId,
      folderId,
      listId,
      list_start_date,
      list_due_date
    );

    return response;
  }
  async getUpdatePriority(
    workspaceId: string,
    folderId: string,
    listId: string,
    priority: string
  ): Promise<boolean> {
    let response = await this.listRepository.updatePriority(
      workspaceId,
      folderId,
      listId,
      priority
    );

    return response;
  }
  async getAllListPage(
    workspaceId: string,
    folderId: string,
    page: string
  ): Promise<ListDataTypePage> {
    const lists = await this.listRepository.allListPage(
      workspaceId,
      folderId,
      page
    );

    const total = await this.listRepository.getCountLists(
      workspaceId,
      folderId
    );

    let listsData: ListDataTypePage = {
      lists: lists,
      total: total,
    };

    return listsData;
  }
  async getallList(
    workspaceId: string,
    folderId: string
  ): Promise<ListDataType[] | null> {
    let response = await this.listRepository.allList(workspaceId, folderId);

    if (!response) {
      return null;
    }
    return response;
  }

  async isListExist(
    workspaceId: string,
    folderId: string,
    listTitle: string
  ): Promise<Boolean> {
    let response = await this.listRepository.listExist(
      workspaceId,
      folderId,
      listTitle
    );
    return response;
  }
  async createList(
    workspaceId: string,
    folderId: string,
    listData: Partial<ListDataType>
  ): Promise<ListDataType | null> {
    let response = await this.listRepository.createNewList(
      workspaceId,
      folderId,
      listData
    );

    if (!response) {
      return null;
    }
    return response;
  }
}

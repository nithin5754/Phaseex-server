import { ListDataType } from "../Entities/List";
import {
  IListRepository,
  ListDataTypePage,
} from "../Interfaces/IListRepository";
import { IListService } from "../Interfaces/IListService";

export class ListService implements IListService {
  private listRepository: IListRepository;
  constructor(listRepository: IListRepository) {
    this.listRepository = listRepository;
  }
 async getUpdateListDate(
    workspaceId: string,
    folderId: string,
    listId: string,
    list_start_date: string,
    list_due_date: string
  ): Promise<boolean> {
    let response=await this.listRepository.updateListDate(workspaceId,folderId,listId,list_start_date,list_due_date)

    return response
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

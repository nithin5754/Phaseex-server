import { ListDataType } from "../../../../Entities/List";
import {
  IListRepository,
  ListDataTypePage,
} from "../../../../Interfaces/IListRepository";

import { List as ListModal } from "../models/ListModal";
import moment from "moment";

export class ListRepository implements IListRepository {
 async listExistById(workspaceId: string, folderId: string, listId: string): Promise<Boolean> {
    let response = await ListModal.findOne({
      workspaceId,
      folderId,
      _id:listId,
    });

    if (response && response._id) {
      return true;
    }

    return false;
  }
  async singleList(workspaceId: string, folderId: string, listId: string): Promise<ListDataType | null> {
   
const response=await ListModal.findOne({workspaceId,folderId,_id:listId})

if(response){
  let responseData:ListDataType={
    id: response._id.toString() as string,
    workspaceId: response.workspaceId?.toString() as string,
    list_description: response.list_description!,
    list_title: response.list_title!,
    createdAt: moment(response.createdAt).format("MMMM D, YYYY - h:mm A"),
    updatedAt: moment(response.updatedAt).format("MMMM D, YYYY - h:mm A"),
    priority_list: response.priority_list,
    folderId: response.folderId?.toString() as string,
    list_start_date: response.list_start_date!,
    list_due_date: response.list_due_date!,
  }
  return responseData
}

return null

      
  }
async  updateListDate(
    workspaceId: string,
    folderId: string,
    listId: string,
    list_start_date: string,
    list_due_date: string
  ): Promise<boolean> {
   
     
    const updateList = await ListModal.findOneAndUpdate(
      { workspaceId, folderId, _id: listId },
      { $set: { list_start_date,list_due_date } },
      { new: true }
    );
 return !!updateList

  }
  async updatePriority(
    workspaceId: string,
    folderId: string,
    listId: string,
    priority: string
  ): Promise<boolean> {

    const updateList = await ListModal.findOneAndUpdate(
      { workspaceId, folderId, _id: listId },
      { $set: { priority_list: priority } },
      { new: true }
    );
 

    return !!updateList;
  }

  async getCountLists(workspaceId: string, folderId: string): Promise<number> {
    const total: number = await ListModal.countDocuments({
      workspaceId,
      folderId,
    });

    return total;
  }
  async allListPage(
    workspaceId: string,
    folderId: string,
    page: string
  ): Promise<ListDataType[] | null> {
    const LIMIT: number = 4;
    const startIndex: number = (Number(page) - 1) * LIMIT;

    const response = await ListModal.find({ workspaceId, folderId })
      .sort({ createdAt: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    if (response) {
      let responseData: ListDataType[] = response.map((list) => ({
        id: list._id.toString() as string,
        workspaceId: list.workspaceId?.toString() as string,
        list_description: list.list_description!,
        list_title: list.list_title!,
        createdAt: moment(list.createdAt).format("MMMM D, YYYY - h:mm A"),
        updatedAt: moment(list.updatedAt).format("MMMM D, YYYY - h:mm A"),
        priority_list: list.priority_list,
        folderId: list.folderId?.toString() as string,
        list_start_date: list.list_start_date!,
        list_due_date: list.list_due_date!,
      }));

      return responseData;
    }

    return null;
  }

  async allList(
    workspaceId: string,
    folderId: string
  ): Promise<ListDataType[] | null> {
    let response = await ListModal.find({ workspaceId, folderId });

    if (response) {
      let responseData = response.map((list) => ({
        id: list._id.toString() as string,
        workspaceId: list.workspaceId?.toString() as string,
        list_description: list.list_description!,
        list_title: list.list_title!,
        createdAt: moment(list.createdAt).format("MMMM D, YYYY - h:mm A"),
        updatedAt: moment(list.updatedAt).format("MMMM D, YYYY - h:mm A"),
        priority_list: list.priority_list,
        folderId: list.folderId?.toString() as string,
        list_start_date: list?.list_start_date!,
        list_due_date: list?.list_due_date!,
      }));
      return responseData;
    }

    return null;
  }
  async listExist(
    workspaceId: string,
    folderId: string,
    listTitle: string
  ): Promise<Boolean> {
    let response = await ListModal.findOne({
      workspaceId,
      folderId,
      list_title: listTitle,
    });

    if (response && response.list_title) {
      return true;
    }

    return false;
  }

  async createNewList(
    workspaceId: string,
    folderId: string,
    listData: Partial<ListDataType>
  ): Promise<ListDataType | null> {
    let data: Partial<ListDataType> = {
      ...listData,
      workspaceId: workspaceId,
      folderId: folderId,
    };

    let newList = await ListModal.create(data);

    if (newList) {
      let newListData: ListDataType = {
        id: newList._id.toString() as string,
        workspaceId: newList.workspaceId?.toString() as string,
        list_description: newList.list_description!,
        list_title: newList.list_title!,
        createdAt: moment(newList.createdAt).format("MMMM D, YYYY - h:mm A"),
        updatedAt: moment(newList.updatedAt).format("MMMM D, YYYY - h:mm A"),
        priority_list: newList.priority_list,
        folderId: newList.folderId?.toString() as string,
        list_start_date: newList.list_start_date!,
        list_due_date: newList.list_due_date!,
      };
      return newListData;
    }

    return null;
  }
}

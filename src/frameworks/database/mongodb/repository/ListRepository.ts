import mongoose from "mongoose";
import {
  ListCollaboratorDetailType,
  ListCollaboratorType,
  ListDataType,
  listCollabRole,
} from "../../../../Entities/List";
import { IListRepository } from "../../../../Interfaces/IListRepository";

import { List as ListModal } from "../models/ListModal";
import moment from "moment";

export class ListRepository implements IListRepository {
 async deleteListWithWspace(workspaceId: string): Promise<boolean> {
    let response=await ListModal.findOneAndDelete({ workspaceId});

    return !!response
  }


  
 async deleteList(workspaceId: string, folderId: string, listId: string): Promise<boolean> {
    
      let response=await ListModal.findOneAndDelete({ workspaceId,_id:listId,folderId});

      return !!response
       
  }
  async checkCollaboratorInList(
    workspaceId: string,
    folderId: string,
    listId: string,
    collaboratorId: string
  ): Promise<boolean> {
    const query = {
      workspaceId: new mongoose.Types.ObjectId(workspaceId),
      folderId: new mongoose.Types.ObjectId(folderId),
      _id: new mongoose.Types.ObjectId(listId),
      list_collaborators: {
        $elemMatch: {
          assignee: new mongoose.Types.ObjectId(collaboratorId),
          role: "viewer",
        },
      },
    };

    const task = await ListModal.findOne(query);

    return !!task;
  }
  async deleteListCollabByListId(
    workspaceId: string,
    folderId: string,
    listId: string,
    collabId: string
  ): Promise<boolean> {
    const filter = {
      _id: listId,
      workspaceId: workspaceId,
      folderId: folderId,
    };

    const updateQuery = {
      $pull: {
        list_collaborators: {
          assignee: collabId,
        },
      },
    };

    const response = await ListModal.findOneAndUpdate(filter, updateQuery);

    if (response) {
      return true;
    }

    return false;
  }

  async updateListCollabByListId(
    workspaceId: string,
    folderId: string,
    listId: string,
    collabId: string,
    role: listCollabRole
  ): Promise<boolean> {
    const filter = {
      _id: listId,
      workspaceId: workspaceId,
      folderId: folderId,
      "list_collaborators.assignee": collabId,
    };

    const update = {
      $set: {
        "list_collaborators.$.role": role,
      },
    };

    const result = await ListModal.findOneAndUpdate(filter, update);

    if (!result) {
      return false;
    }

    return true;
  }

  async listCollabByListId(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<ListCollaboratorDetailType[] | null> {
    let response = await ListModal.aggregate([
      {
        $match: {
          workspaceId: new mongoose.Types.ObjectId(workspaceId),
          folderId: new mongoose.Types.ObjectId(folderId),
          _id: new mongoose.Types.ObjectId(listId),
        },
      },
      {
        $unwind: "$list_collaborators",
      },

      {
        $lookup: {
          from: "users",
          localField: "list_collaborators.assignee",
          foreignField: "_id",
          as: "collaborators_details",
        },
      },

      { $project: { collaborators_details: 1, _id: 0 } },
      {
        $unwind: "$collaborators_details",
      },

      {
        $project: {
          id: "$collaborators_details._id",
          fullName: "$collaborators_details.userName",
          email: "$collaborators_details.email",
          imageUrl: "$collaborators_details.profile_image",
          _id: 0,
        },
      },
    ]);

    if (response) {
      return response;
    }

    return null;
  }
  async addCollabToList(
    workspaceId: string,
    folderId: string,
    listId: string,
    collabId: string
  ): Promise<boolean> {
    let response = await ListModal.findOne({
      workspaceId,
      folderId,
      _id: listId,
    });

    if (response) {
      response.list_collaborators.push({ assignee: collabId });
      let isCollabAdd = await response.save();

      return !!isCollabAdd;
    }

    return false;
  }
  async updateProgressTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    percentage: number
  ): Promise<boolean> {
    let updateProgress = await ListModal.findOneAndUpdate(
      { workspaceId, folderId, _id: listId },
      { $set: { progressTask: percentage } },
      { new: true }
    );
    return !!updateProgress;
  }
  async listExistById(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<Boolean> {
    let response = await ListModal.findOne({
      workspaceId,
      folderId,
      _id: listId,
    });

    if (response && response._id) {
      return true;
    }

    return false;
  }
  async singleList(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<ListDataType | null> {
    const response = await ListModal.findOne({
      workspaceId,
      folderId,
      _id: listId,
    });

    if (response) {
      let responseData: ListDataType = {
        id: response._id.toString() as string,
        workspaceId: response.workspaceId?.toString() as string,
        list_description: response.list_description!,
        list_title: response.list_title!,
        progressTask: response.progressTask,
        createdAt: moment(response.createdAt).format("MMMM D, YYYY - h:mm A"),
        updatedAt: moment(response.updatedAt).format("MMMM D, YYYY - h:mm A"),
        priority_list: response.priority_list,
        folderId: response.folderId?.toString() as string,
        list_start_date: response.list_start_date!,
        list_due_date: response.list_due_date!,
        list_collaborators: response.list_collaborators.map(
          (collaborator: any) => ({
            assignee: collaborator?.assignee?.toString(),
            role: collaborator.role,
          })
        ),
      };
      return responseData;
    }

    return null;
  }
  async updateListDate(
    workspaceId: string,
    folderId: string,
    listId: string,
    list_start_date: string,
    list_due_date: string
  ): Promise<boolean> {
    const updateList = await ListModal.findOneAndUpdate(
      { workspaceId, folderId, _id: listId },
      { $set: { list_start_date, list_due_date } },
      { new: true }
    );
    return !!updateList;
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
        progressTask: list.progressTask,
        createdAt: moment(list.createdAt).format("MMMM D, YYYY - h:mm A"),
        updatedAt: moment(list.updatedAt).format("MMMM D, YYYY - h:mm A"),
        priority_list: list.priority_list,
        folderId: list.folderId?.toString() as string,
        list_start_date: list.list_start_date!,
        list_due_date: list.list_due_date!,
        list_collaborators: list.list_collaborators.map(
          (collaborator: any) => ({
            assignee: collaborator?.assignee?.toString(),
            role: collaborator.role,
          })
        ),
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
        progressTask: list.progressTask,
        createdAt: moment(list.createdAt).format("MMMM D, YYYY - h:mm A"),
        updatedAt: moment(list.updatedAt).format("MMMM D, YYYY - h:mm A"),
        priority_list: list.priority_list,
        folderId: list.folderId?.toString() as string,
        list_start_date: list?.list_start_date!,
        list_due_date: list?.list_due_date!,
        list_collaborators: list.list_collaborators.map(
          (collaborator: any) => ({
            assignee: collaborator?.assignee?.toString(),
            role: collaborator.role,
          })
        ),
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
        progressTask: newList.progressTask,
        createdAt: moment(newList.createdAt).format("MMMM D, YYYY - h:mm A"),
        updatedAt: moment(newList.updatedAt).format("MMMM D, YYYY - h:mm A"),
        priority_list: newList.priority_list,
        folderId: newList.folderId?.toString() as string,
        list_start_date: newList.list_start_date!,
        list_due_date: newList.list_due_date!,
        list_collaborators: newList.list_collaborators.map(
          (collaborator: any) => ({
            assignee: collaborator?.assignee?.toString(),
            role: collaborator.role,
          })
        ),
      };
      return newListData;
    }

    return null;
  }
}

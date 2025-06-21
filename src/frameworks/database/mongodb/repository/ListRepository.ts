import { ListDataType, ListStatus } from "../../../../Entities/List";
import { IListRepository } from "../../../../interfaces/IListRepository";
import { List as ListModal } from "../models/ListModal";
import moment from "moment";

export class ListRepository implements IListRepository {
  private convertSingleList(response: any): ListDataType {
    return {
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
          assignee: collaborator?.assignee?._id?.toString(),
          assignee_name: collaborator?.assignee?.userName,
          role: collaborator.role,
        })
      ),
      status: response.status,
    };
  }

  private convertArrayList(response: any): ListDataType[] {
    let data: ListDataType[] = [];

    for (const list of response) {
      data.push({
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
            assignee: collaborator?.assignee?._id?.toString(),
            assignee_name: collaborator?.assignee?.userName,
            role: collaborator.role,
          })
        ),
        status: list.status,
      });
    }

    return data;
  }

  async updateListStatus(
    workspaceId: string,
    folderId: string,
    listId: string,
    status: ListStatus
  ): Promise<boolean> {
    const response = await ListModal.updateOne(
      { workspaceId, folderId, _id:listId },
      { $set: { status } }
    );

    console.log('update list status',response)

    return !!response;
  }
  async addManagerViewerList(
    workspaceId: string,
    folderId: string,
    listId: string,
    memberId: string,
    role: "manager" | "viewer"
  ): Promise<boolean> {
    const response = await ListModal.updateOne(
      { workspaceId, folderId, _id: listId },
      {
        $addToSet: {
          list_collaborators: {
            assignee: memberId,
            role,
          },
        },
      }
    );

    return !!response;
  }

  async deleteListWithWspace(workspaceId: string): Promise<boolean> {
    let response = await ListModal.deleteMany({ workspaceId });

    return !!response;
  }

  async deleteList(
    workspaceId: string,
    folderId: string,
    listId: string
  ): Promise<boolean> {
    const response = await ListModal.findOneAndDelete({
      workspaceId,
      _id: listId,
      folderId,
    });

    return !!response;
  }

  async updateProgressTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    percentage: number
  ): Promise<boolean> {
    const updateProgress = await ListModal.findOneAndUpdate(
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
    const response = await ListModal.findOne({
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
    })
      .populate("list_collaborators.assignee")
      .lean()
      .exec();

    if (response) {
      const responseData: ListDataType = this.convertSingleList(response);
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
      .populate("list_collaborators.assignee")
      .lean()
      .sort({ createdAt: -1 })
      .limit(LIMIT)
      .skip(startIndex)
      .exec();

    if (response) {
      const responseData: ListDataType[] = this.convertArrayList(response);

      return responseData;
    }

    return null;
  }

  async allList(
    workspaceId: string,
    folderId: string
  ): Promise<ListDataType[] | null> {
    const response = await ListModal.find({ workspaceId, folderId })
      .populate("list_collaborators.assignee")
      .lean()
      .exec();

    if (response) {
      const responseData = this.convertArrayList(response);
      return responseData;
    }

    return null;
  }
  async listExist(
    workspaceId: string,
    folderId: string,
    listTitle: string
  ): Promise<Boolean> {
    const response = await ListModal.findOne({
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
    userId: string,

    listData: Partial<ListDataType>
  ): Promise<ListDataType | null> {
    let data: Partial<ListDataType> = {
      ...listData,
      workspaceId: workspaceId,
      folderId: folderId,
      list_collaborators: [{ assignee: userId, role: "owner" }],
    };

    const response = await ListModal.create(data);

    if (response) {
      let result: ListDataType = this.convertSingleList(response);
      return result;
    }

    return null;
  }
}

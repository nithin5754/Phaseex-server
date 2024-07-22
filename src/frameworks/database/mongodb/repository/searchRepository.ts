import { User, UserType } from "../../../../Entities/Users";
import { ISearchRepository } from "../../../../interfaces/ISearchRepository";
import UserModal from "../models/UserModel";
import { Todo as TodoModal } from "../models/TodoModal";
import { TodoType } from "../../../../Entities/Todo";
import moment from "moment";
import { WorkspaceDataType } from "../../../../Entities/WorkspaceDataType";
import { Workspace as workspaceModal } from "../models/spaceModal";
import { Task as TaskModal } from "../models/TaskModal";
import mongoose from "mongoose";

export interface WorkSpaceCollabType {
  id: string;
  fullName: string;
  email: string;
}

export interface STaskCollabType {
  id: string;
  fullName: string;
  email: string;
}

export class SearchRepo implements ISearchRepository {
  constructor() {}
  async searchCollaboratorInTask(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    collabKey: string
  ): Promise<STaskCollabType[] | null> {
    const regexPattern = new RegExp(`.*${collabKey}.*`, "i");

    const response = await TaskModal.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(taskId),
          workspaceId: new mongoose.Types.ObjectId(workspaceId),
          folderId: new mongoose.Types.ObjectId(folderId),
          listId: new mongoose.Types.ObjectId(listId)

        },
      },
      {
        $unwind: "$task_collaborators",
      },

      {
        $lookup: {
          from: "users",
          localField: "task_collaborators.assigneeId",
          foreignField: "_id",
          as: "collaborators_details",
        },
      },
      { $project: { collaborators_details: 1, _id: 0 } },
      { $unwind: "$collaborators_details" },
      {
        $project: {
          id: "$collaborators_details._id",
          fullName: "$collaborators_details.userName",
          email: "$collaborators_details.email",
          _id: 0,
        },
      },
      {
        $match: { fullName: regexPattern },
      },
    ]);

    if (response) {
      let responseData: STaskCollabType[] = response.map((collab) => ({
        ...collab,
        id: collab.id.toString() as string,
      }));

      return responseData;
    }

    return null;
  }
  async searchCollaboratorInSpace(
    workspaceId: string,
    collabKey: string
  ): Promise<WorkSpaceCollabType[] | null> {
    const regexPattern = new RegExp(`.*${collabKey}.*`, "i");

    const response = await workspaceModal.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(workspaceId) },
      },
      {
        $unwind: "$collaborators",
      },

      {
        $match: {
          "collaborators.verified": true,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "collaborators.assignee",
          foreignField: "_id",
          as: "collaborators_details",
        },
      },
      { $project: { collaborators_details: 1, _id: 0 } },
      { $unwind: "$collaborators_details" },
      {
        $project: {
          id: "$collaborators_details._id",
          fullName: "$collaborators_details.userName",
          email: "$collaborators_details.email",
          _id: 0,
        },
      },
      {
        $match: { fullName: regexPattern },
      },
    ]);

    if (response) {
      let responseData: WorkSpaceCollabType[] = response.map((collab) => ({
        ...collab,
        id: collab.id.toString() as string,
      }));

      return responseData;
    }

    return null;
  }

  async searchUsers(searchKey: string): Promise<UserType[] | null> {
    let response = await UserModal.find({
      $or: [{ userName: { $regex: searchKey } }],
    });

    if (response) {
      let responseData: UserType[] = response.map((user) => ({
        id: user._id,
        userName: user.userName,
        email: user.email,
        profile_image: user.profile_image,
        roles: user.roles,
        verified: user.verified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      return responseData;
    }

    return null;
  }

  async searchTodo(
    workspaceId: string,
    folderId: string,
    listId: string,
    taskId: string,
    todoKey: string
  ): Promise<TodoType[] | null> {
    let response = await TodoModal.find({
      $or: [
        { workspaceId, folderId, listId, taskId, todo: { $regex: todoKey } },
      ],
    });

    if (response) {
      let responseData: TodoType[] = response.map((todo) => {
        return {
          id: todo._id.toString() as string,
          workspaceId: todo.workspaceId.toString() as string,
          folderId: todo.folderId.toString() as string,
          listId: todo.listId.toString() as string,
          taskId: todo.taskId.toString() as string,
          todo: todo.todo,
          assignee: todo.assignee ? todo.assignee.toString() : "",
          todo_status: todo.todo_status,
          createdAt: moment(todo.createdAt).format("MMMM D, YYYY - h:mm A"),
          updatedAt: moment(todo.updatedAt).format("MMMM D, YYYY - h:mm A"),
        };
      });

      return responseData;
    }
    return null;
  }
}

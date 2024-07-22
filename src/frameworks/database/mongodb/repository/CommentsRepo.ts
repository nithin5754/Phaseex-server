import mongoose from "mongoose";
import {
  CommentList,
  CreateTopComment,
  SendGetAllComment,
} from "../../../../Entities/comment";
import { ICommentsRepo } from "../../../../interfaces/ICommentsRepo";

import { comments as commentsModal } from "../models/CommentsModal";
import moment from "moment";

export class CommentsRepo implements ICommentsRepo {
 async countAllComments(workspaceId: string, folderId: string, listId: string, taskId: string, todoId: string): Promise<number> {
    const result = await commentsModal.aggregate([
      {
        $match: {
          workspaceId: new mongoose.Types.ObjectId(workspaceId),
          folderId: new mongoose.Types.ObjectId(folderId),
          listId: new mongoose.Types.ObjectId(listId),
          taskId: new mongoose.Types.ObjectId(taskId),
          todoId: new mongoose.Types.ObjectId(todoId),
        },
      },
      {
        $count: "totalDocuments",
      },
    ]);
    const totalDocuments:number = result[0]?.totalDocuments || 0;


    return totalDocuments
  }

  async getAllCommentInTodoId(
    data: SendGetAllComment
  ): Promise<CommentList[] | null> {
    const allComments = await commentsModal.aggregate([
      {
        $match: {
          workspaceId: new mongoose.Types.ObjectId(data.workspaceId),
          folderId: new mongoose.Types.ObjectId(data.folderId),
          listId: new mongoose.Types.ObjectId(data.listId),
          taskId: new mongoose.Types.ObjectId(data.taskId),
          todoId: new mongoose.Types.ObjectId(data.todoId),
          parent: null,
        },
      },
      {
        $graphLookup: {
          from: "comments",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parent",
          as: "children",
          maxDepth: 5,
          depthField: "depth",
        },
      },
      {
        $set: {
          children: {
            $sortArray: {
              input: "$children",
              sortBy: { createdAt: -1 },
            },
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    if (allComments && allComments.length > 0) {
      const commentList: CommentList[] = allComments.map((comment: any) => ({
        id: comment._id.toString(),
        workspaceId: comment.workspaceId.toString(),
        folderId: comment.folderId.toString(),
        listId: comment.listId.toString(),
        taskId: comment.taskId.toString(),
        todoId: comment.todoId.toString(),
        message: comment.message,
        userId: comment.userId ? comment.userId.toString() : null,
        parent: comment.parent ? comment.parent.toString() : null,
        children: comment.children.map((childComment: any) => ({
          id: childComment._id.toString(),
          workspaceId: childComment.workspaceId.toString(),
          folderId: childComment.folderId.toString(),
          listId: childComment.listId.toString(),
          taskId: childComment.taskId.toString(),
          todoId: childComment.todoId.toString(),
          message: childComment.message,
          userId: childComment.userId ? childComment.userId.toString() : null,
          parent: childComment.parent ? childComment.parent.toString() : null,
          createdAt: moment(childComment.createdAt).format(
            "MMMM D, YYYY - h:mm A"
          ),
          updatedAt: moment(childComment.updatedAt).format(
            "MMMM D, YYYY - h:mm A"
          ),
        })),
        createdAt: moment(comment.createdAt).format("MMMM D, YYYY - h:mm A"),
        updatedAt: moment(comment.updatedAt).format("MMMM D, YYYY - h:mm A"),
      }));

      return commentList;
    }

    return null;
  }

  async addReplyToComment(
    data: CreateTopComment,
    parentId: string
  ): Promise<boolean> {
    const reply = new commentsModal({
      workspaceId: data.workspaceId,
      folderId: data.folderId,
      listId: data.listId,
      taskId: data.taskId,
      todoId: data.todoId,
      parent: parentId,
      message: data.message,
      userId: data.userId,
    });

    let response = await reply.save();

    if (response) {
      let isUpdate = await commentsModal.findByIdAndUpdate(parentId, {
        $push: { children: reply._id },
      });
      return !!isUpdate;
    }

    return false;
  }

  async addTopLevelComment(data: CreateTopComment) {
    const newComment = new commentsModal({
      workspaceId: data.workspaceId,
      folderId: data.folderId,
      listId: data.listId,
      taskId: data.taskId,
      todoId: data.todoId,
      message: data.message,
      userId: data.userId,
    });

    let response = await newComment.save();

    return !!response;
  }
}

import { NextFunction, Request, Response } from "express";
import { CActivityType } from "../../Entities/activity";
import { IActivityService } from "../../Interfaces/IActivityService";

export class ActivityController {
  private activityService: IActivityService;

  constructor(activityService: IActivityService) {
    this.activityService = activityService;
  }

  OnCreateActivity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId, taskId, activity } = req.body;

      console.log(req.body, "what is missing");

      if (!workspaceId || !folderId || !listId || !activity || !taskId) {
        return res.status(404).json({ message: "missing credential" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof activity !== "string" ||
        typeof taskId !== "string"
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }

      let activityCData: CActivityType = {
        workspaceId,
        folderId,
        listId,
        taskId,
        activity: {
          message: activity,
        },
      };

      let response = await this.activityService.getCreateActivity(
        activityCData
      );

      console.log(activityCData, "activity data.....");

      if (!response) {
        return res.status(400).json("something went wrong");
      }

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  onGetAllActivity = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { workspaceId, folderId, listId, taskId } = req.query;



      if (!workspaceId || !folderId || !listId || !taskId) {
        return res.status(404).json({ message: "missing credential" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof taskId !== "string"
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }

      const getAllActivity = await this.activityService.getAllActivity(
        workspaceId,
        folderId,
        listId,
        taskId
      );

      if (!getAllActivity) {
        return res.status(404).json("activity empty");
      }

      return res.status(200).json(getAllActivity);
    } catch (error) {
      next(error);
    }
  };
}

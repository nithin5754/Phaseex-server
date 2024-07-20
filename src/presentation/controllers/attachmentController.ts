import { NextFunction, Request, Response } from "express";
import {
  SendAttachment,
  SendAttachmentDetails,
} from "../../Entities/attachment";
import { IAttachmentService } from "../../Interfaces/IAttachmentService";
import { IMulterConverter } from "../../Interfaces/IMulterConverter";
import { ICloudinaryStorage } from "../../Interfaces/ICloudinaryStorage";

export class AttachmentController {
  private attachMentService: IAttachmentService;
  private multerConverter: IMulterConverter;
  private ICloudinary: ICloudinaryStorage;

  constructor(
    attachMentService: IAttachmentService,
    multerConverter: IMulterConverter,
    ICloudinary: ICloudinaryStorage
  ) {
    this.attachMentService = attachMentService;
    this.multerConverter = multerConverter;
    this.ICloudinary = ICloudinary;
  }

  OnAddAttachment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let {
        folderId,
        workspaceId,
        listId,
        taskId,
        attachmentName,
        attachment_description,
      } = req.body;
      const file = req.file;

      if (
        !listId ||
        !folderId ||
        !workspaceId ||
        !taskId ||
        !attachmentName ||
        !attachment_description ||
        !file
      ) {
        return res.status(400).json({
          message: "credentials missing  please try again after some times",
        });
      }

      let dataURI = this.multerConverter.convertFileToString(file);

      let image = await this.ICloudinary.uploadPhoto(dataURI);

      if (!image) {
        return res
          .status(404)
          .json({ message: "something went wrong please try again !" });
      }

      let SendAttachment: SendAttachmentDetails = {
        name: attachmentName,
        description: attachment_description,
        url: image.url,
      };

      let sendData: SendAttachment = {
        workspaceId,
        folderId,
        listId,
        taskId,
        attachment: SendAttachment,
      };

      if (sendData) {
        let isCreated = await this.attachMentService.getCreateAttachment(
          sendData
        );

        return res.status(200).json(isCreated);
      }
      res.status(200);
    } catch (error) {
      next(error);
    }
  };

  onGetallAttachmentByTaskId = async (
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

      let isGetallAttachmentByTaskId =
        await this.attachMentService.getAllAttachmentInTaskId(
          workspaceId,
          folderId,
          listId,
          taskId
        );

      if (!isGetallAttachmentByTaskId) {
        return res.status(404).json({ message: "something went wrong" });
      }

      return res.status(200).json(isGetallAttachmentByTaskId);
    } catch (error) {
      next(error);
    }
  };

  OnGetDeleteAttachment= async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
      
    try {
      const { workspaceId, folderId, listId, taskId ,attachment_id} = req.body;
      if (!workspaceId || !folderId || !listId || !taskId||!attachment_id) {
        return res.status(404).json({ message: "missing credential" });
      }

      if (
        typeof workspaceId !== "string" ||
        typeof folderId !== "string" ||
        typeof listId !== "string" ||
        typeof taskId !== "string" ||
        typeof attachment_id !=='string'
      ) {
        return res.status(404).json({
          message: "wrong credentials please try again after some times",
        });
      }


      let isDeleted=await this.attachMentService.deleteSingleAttachment(
        workspaceId,
        folderId,
        listId,
        taskId,
        attachment_id
      )

      if(!isDeleted){
        return res.status(404).json({message:"not found please try again later"})
      }

      return res.status(200).json(isDeleted)


      
    } catch (error) {
      next(error)
    }

   }
}

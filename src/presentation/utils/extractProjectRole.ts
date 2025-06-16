import { NextFunction, Request, Response } from "express";
import { Workspace } from "../../frameworks/database/mongodb/models/spaceModal";
import { WorkspaceDataType } from "../../Entities/WorkspaceDataType";
import { Role } from "./rolesPermission";

declare global {
  namespace Express {
    interface Request {
      projectRole?: Role;
    }
  }
}
function convertSpaceData(response: any): WorkspaceDataType {
  return {
    collaborators: response.collaborators.map((collaborator: any) => ({
      assignee: collaborator.assignee.toString() as string,
      role: collaborator.role,
      verified: collaborator.verified,
    })),
    id: response._id.toString() as string,
    workspaceOwner: response.workspaceOwner?.toString() as string,
    title: response.title,
    workspace_description: response.workspace_description,
    workspaceType: response.workspaceType,
    active: response.active,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

export const extractProjectRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const spaceId = req.params.spaceId || req.body.spaceId;
  const userId = req.userId;
  if (!spaceId) return res.status(400).json({ message: "Project ID missing" });

  try {
    const space = await Workspace.findById(spaceId);

    if (!space) return res.status(404).json({ message: "Space not found" });

    const result: WorkspaceDataType = convertSpaceData(space);

    const member = result.collaborators.find(
      (collab: any) => collab.assignee === userId
    );

    if (!member) {
      return res
        .status(403)
        .json({ message: "You are not part of this project" });
    }

    req.projectRole = member.role as Role;

    console.log("role", req.projectRole);

    next();
  } catch (error) {
    next(error);
  }
};

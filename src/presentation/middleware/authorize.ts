import { NextFunction, Request, Response } from "express";
import {
  Permission,
  Role,
  ROLE_PERMISSIONS,

} from "../utils/rolesPermission";

export const authorize = (data: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role: Role | undefined = req.projectRole;

    if (!role) {
      return res.status(403).json({ message: "Permission denied" });
    }

    const permission = ROLE_PERMISSIONS[role];

    const hasPermission: boolean = permission[data];
    if (!hasPermission) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};

import mongoose from "mongoose";
import { WorkspaceDataType } from "../../../../Entities/WorkspaceDataType";
import ISpaceRepository from "../../../../interfaces/ISpaceRepository";
import { Workspace as workspaceModal } from "../models/spaceModal";
import UserModel from "../models/UserModel";

export class workSpaceRepository implements ISpaceRepository {
  async getHiddenSpaceByOwnerLists(
    workspaceOwner: string
  ): Promise<WorkspaceDataType[] | null> {
    let response = await workspaceModal
      .find({ workspaceOwner, active: false })
      .sort({ createdAt: -1 });

    if (response && response.length > 0) {
      let responseData: WorkspaceDataType[] = this.convertDataArray(response);
      return responseData;
    }

    return null;
  }
  async getLiveSpaceByOwnerLists(
    workspaceOwner: string
  ): Promise<WorkspaceDataType[] | null> {
    let response = await workspaceModal
      .find({ workspaceOwner, active: true })
      .sort({ createdAt: -1 });

    if (response && response.length > 0) {
      let responseData: WorkspaceDataType[] = this.convertDataArray(response);
      return responseData;
    }

    return null;
  }
  async getInvitesSpaceLists(
    workspaceOwner: string
  ): Promise<WorkspaceDataType[] | null> {
    let response = await workspaceModal.aggregate([
      {
        $match: {
          collaborators: {
            $elemMatch: {
              assignee: new mongoose.Types.ObjectId(workspaceOwner),
              verified: true,
            },
          },
        },
      },
    ]);

    if (response && response.length > 0) {
      let responseData: WorkspaceDataType[] = this.convertDataArray(response);
      return responseData;
    }

    return null;
  }
  async findWorkSpaceByName(title: string): Promise<boolean> {
    const response = await workspaceModal.find({ title });

    if (response.length > 0) {
      return true;
    }
    return false;
  }

  async create(data: Partial<WorkspaceDataType>): Promise<any> {
    const response = await workspaceModal.create(data);

    if (response) {
      let responseData: WorkspaceDataType = this.convertSpaceData(response);

      return responseData;
    }
  }

  async findAllSpaceByOwner(
    workspaceOwner: string
  ): Promise<WorkspaceDataType[] | null> {
    let response = await workspaceModal
      .find({ workspaceOwner })
      .sort({ createdAt: -1 });

    if (response && response.length > 0) {
      let responseData: WorkspaceDataType[] = this.convertDataArray(response);
      return responseData;
    }

    return null;
  }

  async changeVisibility(id: string, workspaceOwner: string): Promise<boolean> {
    const workspace = await workspaceModal.findOne({ _id: id, workspaceOwner });
    if (workspace) {
      workspace.active = !workspace.active;
      await workspace.save();
      return true;
    }

    return false;
  }

  // delete workspace

  async deleteWorkspace(workspaceId: string): Promise<boolean> {
    let response = await workspaceModal.findOneAndDelete({ _id: workspaceId });

    return !!response;
  }

  async findSpaceById(workspace_id: string): Promise<WorkspaceDataType | null> {
    const response = await workspaceModal.findById(workspace_id);
    if (response) {
      let singleWorkSpace: WorkspaceDataType = this.convertSpaceData(response);
      return singleWorkSpace;
    }

    return null;
  }

  async allCollaboratorInSpace(
    workspaceId: string
  ): Promise<WorkspaceDataType | null> {
    const response = await workspaceModal.findById(workspaceId);

    if (response) {
      return this.convertSpaceData(response);
    }

    return null;
  }

  async findByIdForName(id: string): Promise<string | null> {
    let found = await UserModel.findById(id);

    if (!found) {
      return null;
    } else {
      return found.userName;
    }
  }

  async addCollaboratorsToSpace(
    workspaceId: string,
    collaboratorId: string
  ): Promise<boolean> {
    const workspace = await workspaceModal.findById(workspaceId);

    if (workspace) {
      workspace.collaborators.push({ assignee: collaboratorId });
      let response = await workspace.save();

      return !!response;
    }

    return false;
  }

  async deleteCollaboratorsToSpace(
    workspaceId: string,
    collaboratorId: string
  ): Promise<boolean> {
    const workspace: any = await workspaceModal.findById(workspaceId);

    if (workspace) {
      if (workspace.collaborators) {
        workspace.collaborators = workspace?.collaborators?.filter(
          (collaborator: any) =>
            collaborator?.assignee.toString() !== collaboratorId.toString()
        );
      }

      await workspace.save();

      return true;
    }

    return false;
  }

  async updateCollaboratorsVerified(
    workspaceId: string,
    collaboratorId: string
  ): Promise<boolean> {
    const result = await workspaceModal.updateOne(
      { _id: workspaceId, "collaborators.assignee": collaboratorId },
      { $set: { "collaborators.$.verified": true } }
    );

    return !!result;
  }



  async  updateCollaboratorsRole(workspaceId: string, collaboratorId: string, role: string): Promise<boolean> {
      
    
    const result = await workspaceModal.updateOne(
      { _id: workspaceId, "collaborators.assignee": collaboratorId },
      { $set: { "collaborators.$.role": role } }
    );



    return !!result
  }

  convertDataArray(response: any): WorkspaceDataType[] {
    return response.map((workspace: any) => ({
      collaborators: workspace.collaborators.map((collaborator: any) => ({
        assignee: collaborator.assignee.toString(),
        role: collaborator.role,
        verified: collaborator.verified,
      })),
      id: workspace._id.toString() as string,
      workspaceOwner: workspace.workspaceOwner?.toString() as string,
      title: workspace.title,
      workspace_description: workspace.workspace_description,
      workspaceType: workspace.workspaceType,
      active: workspace.active,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    }));
  }

  convertSpaceData(response: any): WorkspaceDataType {
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
}

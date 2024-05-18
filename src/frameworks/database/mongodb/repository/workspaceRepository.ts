import { WorkspaceDataType } from "../../../../Entities/WorkspaceDataType";
import ISpaceRepository from "../../../../Interfaces/ISpaceRepository";
import { Workspace as workspaceModal } from "../models/spaceModal";

export class workSpaceRepository implements ISpaceRepository {
  findByName(workspace_name: string): Promise<WorkspaceDataType | null> {
    throw new Error("Method not implemented.");
  }
  async findAllByUser(workspaceOwner: string): Promise<WorkspaceDataType[] | null> {
     
    let response=await workspaceModal.find({workspaceOwner})
    console.log(response,"from db space");
    
    
    if(response&&response.length>0){
      let responseData:WorkspaceDataType[]=response.map(workspace=>(
        
        {
            collaborators: workspace.collaborators.map((collaborator:any) => ({
              assigneeId: collaborator.assignee.toString(),
              role: collaborator.role,
            })),
            id: workspace._id.toString() as string,
            workspaceOwner: workspace.workspaceOwner?.toString() as string,
            title: workspace.title,
            workspace_description: workspace.workspace_description,
            workspaceType: workspace.workspaceType,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
          }
        
      ))
      return responseData
    }

    return null


       
  }
  async create(data: Partial<WorkspaceDataType>): Promise<any> {
    const newSpace = await workspaceModal.create(data);

    if (newSpace) {
      let responseData: WorkspaceDataType = {
        collaborators: newSpace.collaborators.map((collaborator: any) => ({
          assigneeId: collaborator.assignee.toString() as string,
          role: collaborator.role,
        })),
        id: newSpace._id.toString() as string,
        workspaceOwner: newSpace.workspaceOwner?.toString() as string,
        title: newSpace.title,
        workspace_description: newSpace.workspace_description,
        workspaceType: newSpace.workspaceType,
        createdAt: newSpace.createdAt,
        updatedAt: newSpace.updatedAt,
      };

      return responseData;
    }
  }

}

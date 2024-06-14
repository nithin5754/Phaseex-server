import { WorkspaceDataType } from "../../../../Entities/WorkspaceDataType";
import ISpaceRepository from "../../../../Interfaces/ISpaceRepository";
import { Workspace as workspaceModal } from "../models/spaceModal";
import  UserModel from "../models/UserModel";

export class workSpaceRepository implements ISpaceRepository {

  async findByIdForName(id: string): Promise<string | null> {
    let found = await UserModel.findById(id);

    if (!found) {
      return null;
    } else {
      return found.userName;
    }
  }



  async allCollaboratorInSpace(workspaceId: string): Promise<WorkspaceDataType|null> {
    const workspace=await workspaceModal.findById(workspaceId) 
   if(workspace){
    let singleWorkSpace:WorkspaceDataType={
      collaborators: workspace.collaborators.map((collaborator:any) => ({
        assignee: collaborator.assignee.toString(),
        role: collaborator.role,
      })),
      id: workspace._id.toString() as string,
      workspaceOwner: workspace.workspaceOwner?.toString() as string,
      title: workspace.title,
      workspace_description: workspace.workspace_description,
      workspaceType: workspace.workspaceType,
      active:workspace.active,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    }
    return singleWorkSpace
   }

   return null
  }
 async addCollaboratorsToSpace(workspaceId: string, collaboratorId: string): Promise<boolean> {
    const workspace = await workspaceModal.findById(workspaceId);
   
    if(workspace){
      workspace.collaborators.push({assignee:collaboratorId})
      let response= await workspace.save()

      
      return !!response
    }


    return false





    
       
  }
  async findAllSpaceByOwner(workspaceOwner: string): Promise<WorkspaceDataType[] | null> {
      
    let response=await workspaceModal.find({workspaceOwner}).sort({ createdAt: -1 })

    if(response&&response.length>0){
      let responseData:WorkspaceDataType[]=response.map(workspace=>(
        
        {
            collaborators: workspace.collaborators.map((collaborator:any) => ({
              assignee: collaborator.assignee.toString(),
              role: collaborator.role,
            })),
            id: workspace._id.toString() as string,
            workspaceOwner: workspace.workspaceOwner?.toString() as string,
            title: workspace.title,
            workspace_description: workspace.workspace_description,
            workspaceType: workspace.workspaceType,
            active:workspace.active,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
          }
        
      ))
      return responseData
    }

    return null

  }
  async findWorkSpaceByName(title: string): Promise<boolean> {
      
    const response=await workspaceModal.find({title})

    if(response.length>0){
       return true
    }
   return false
  }




 


 
  



 async findSingleWorkSpace(workspace_id: string): Promise<WorkspaceDataType | null> {
   const workspace=await workspaceModal.findById(workspace_id) 
   if(workspace){
    let singleWorkSpace:WorkspaceDataType={
      collaborators: workspace.collaborators.map((collaborator:any) => ({
        assignee: collaborator.assignee.toString(),
        role: collaborator.role,
      })),
      id: workspace._id.toString() as string,
      workspaceOwner: workspace.workspaceOwner?.toString() as string,
      title: workspace.title,
      workspace_description: workspace.workspace_description,
      workspaceType: workspace.workspaceType,
      active:workspace.active,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    }
    return singleWorkSpace
   }

   return null
   
  }



  async findAllByUserLength(workspaceOwner: string): Promise<number> {
       
      let response=await workspaceModal.countDocuments({workspaceOwner,active:false})

    
        return response
    
  }




  async findAllOnGoing(workspaceOwner: string): Promise<WorkspaceDataType[] | null> {
      let response=await workspaceModal.find({workspaceOwner,active:true})
    .sort({ createdAt: -1 })

    if(response&&response.length>0){
      let responseData:WorkspaceDataType[]=response.map(workspace=>(
        
        {
            collaborators: workspace.collaborators.map((collaborator:any) => ({
              assignee: collaborator.assignee.toString(),
              role: collaborator.role,
            })),
            id: workspace._id.toString() as string,
            workspaceOwner: workspace.workspaceOwner?.toString() as string,
            title: workspace.title,
            workspace_description: workspace.workspace_description,
            workspaceType: workspace.workspaceType,
            active:workspace.active,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
          }
        
      ))
      return responseData
    }

    return null


  }
  async changeVisibility(id: string,workspaceOwner: string): Promise<boolean> {
    const workspace = await workspaceModal.findOne({ _id: id, workspaceOwner});
    if(workspace){
      workspace.active=!workspace.active
      await workspace.save()
       return true
    }
    
return false
      
  }
  findByName(workspace_name: string): Promise<WorkspaceDataType | null> {
    throw new Error("Method not implemented.");
  }
  async findAllByUser(workspaceOwner: string,pageId:number,limit:number): Promise<WorkspaceDataType[] | null> {
    const skip = (pageId - 1) * limit;
    const total=await workspaceModal.countDocuments({active:false})
 
    
    let response=await workspaceModal.find({workspaceOwner,active:false })
    .sort({ createdAt: -1 }).skip(skip).limit(limit)


    
    
    if(response&&response.length>0){
      let responseData:WorkspaceDataType[]=response.map(workspace=>(
        
        {
            collaborators: workspace.collaborators.map((collaborator:any) => ({
              assignee: collaborator.assignee.toString(),
              role: collaborator.role,
            })),
            id: workspace._id.toString() as string,
            workspaceOwner: workspace.workspaceOwner?.toString() as string,
            title: workspace.title,
            workspace_description: workspace.workspace_description,
            workspaceType: workspace.workspaceType,
            active:workspace.active,
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
          assignee: collaborator.assignee.toString() as string,
          role: collaborator.role,
        })),
        id: newSpace._id.toString() as string,
        workspaceOwner: newSpace.workspaceOwner?.toString() as string,
        title: newSpace.title,
        workspace_description: newSpace.workspace_description,
        workspaceType: newSpace.workspaceType,
        active:newSpace.active,
        createdAt: newSpace.createdAt,
        updatedAt: newSpace.updatedAt,
      };

      return responseData;
    }
  }

}

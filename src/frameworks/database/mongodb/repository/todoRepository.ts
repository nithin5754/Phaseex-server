
import moment from "moment";
import { TodoCollabTypeDetails, TodoType } from "../../../../Entities/Todo";
import { ITodoRepository } from "../../../../interfaces/ITodoRepository";
import { Todo as TodoModal } from "../models/TodoModal";
import mongoose from "mongoose";



export class TodoRepository implements ITodoRepository {
async deleteTodoWithWorkspace(workspaceId: string): Promise<boolean> {
  const response=await TodoModal.findOneAndDelete({ workspaceId})

  return !!response
}
async deleteCollabFromAllTodo(workspaceId: string, folderId: string, listId: string, taskId: string, collabId: string): Promise<boolean> {
  let filter={ workspaceId, folderId, listId,taskId,assignee:collabId}
  const query = { $set: { assignee: null } };

  const updateList = await TodoModal.updateMany(filter,query)
  return !!updateList;

}
async deleteCollabTodo(workspaceId: string, folderId: string, listId: string, taskId: string, todoId: string, collabId: string): Promise<boolean> {

  let filter={ workspaceId, folderId, listId,taskId , _id:todoId}
  let query= { $unset: { assignee:collabId} }

  const updateList = await TodoModal.findOneAndUpdate(filter,query)
  return !!updateList;
}
async collabTodoByTodoId(workspaceId: string, folderId: string, listId: string, taskId: string, todoId: string): Promise<TodoCollabTypeDetails[]|null> {


   
  const response:TodoCollabTypeDetails[]=await TodoModal.aggregate([
    {
      $match: {
        workspaceId: new mongoose.Types.ObjectId(workspaceId),
        folderId: new mongoose.Types.ObjectId(folderId),
        listId:new mongoose.Types.ObjectId(listId),
        taskId:new mongoose.Types.ObjectId(taskId),
        _id: new mongoose.Types.ObjectId(todoId),
      },
    },
   


    {
      $lookup: {
        from: "users",
        localField: "assignee",
        foreignField: "_id",
        as: "collaborators_details",
      },
    },
    { $project: { collaborators_details: 1,_id:0 } },
    { $unwind: "$collaborators_details" },

    {
      $project: {
        id: "$collaborators_details._id",
        fullName: "$collaborators_details.userName",
        email: "$collaborators_details.email",
        _id: 0,
      },
    },
  ])

  
   if(!response){
return null
   }

    return response

}
async addCollabToTodo(workspaceId: string, folderId: string, listId: string, taskId: string, todoId: string,collabId:string): Promise<boolean> {
  const updateList = await TodoModal.findOneAndUpdate(
    { workspaceId, folderId, listId,taskId , _id:todoId},
    { $set: { assignee:collabId} },
    { new: true }
  );
 

  return !!updateList;
}
async deleteTodoTask(workspaceId: string, folderId: string, listId: string, taskId: string, todoId: string): Promise<boolean> {
  
    const response=await TodoModal.findOneAndDelete({ workspaceId, folderId, listId,taskId , _id:todoId})


    

    return !!response
}
async checkDuplicateTodo(workspaceId: string, folderId: string, listId: string, taskId: string, todo: string): Promise<boolean> {
 const response=await TodoModal.findOne( { workspaceId, folderId, listId,taskId ,todo})

 return !!response
}
async updateTodoTask(workspaceId: string, folderId: string, listId: string, taskId: string, todoId: string, todo: string): Promise<boolean> {
  const updateList = await TodoModal.findOneAndUpdate(
    { workspaceId, folderId, listId,taskId , _id:todoId},
    { $set: { todo} },
    { new: true }
  );
 

  return !!updateList;
}
async updateStatus(workspaceId: string, folderId: string, listId: string, taskId: string, todoId: string, todo_status: string): Promise<boolean> {
  
  const updateList = await TodoModal.findOneAndUpdate(
    { workspaceId, folderId, listId,taskId , _id:todoId},
    { $set: { todo_status} },
    { new: true }
  );


  return !!updateList;
}
async createTodoTask(todoTaskData: Partial<TodoType>): Promise<TodoType | null> {
  
     let todo=await TodoModal.create(todoTaskData)

     if(todo){
      let responseData={
        id: todo._id.toString() as string,
        workspaceId: todo.workspaceId.toString() as string,
        folderId: todo.folderId.toString() as string,
        listId: todo.listId.toString() as string,
        taskId:todo.taskId.toString() as string,
        todo:todo.todo ,
        assignee: todo.assignee? todo.assignee.toString() : '',
        todo_status:todo.todo_status,
        createdAt: moment(todo.createdAt).format("MMMM D, YYYY - h:mm A"),
        updatedAt: moment(todo.updatedAt).format("MMMM D, YYYY - h:mm A"),

      }
      return responseData
     }
     return null
}
async  allTodoTask(workspaceId: string, folderId: string, listId: string, taskId: string): Promise<TodoType[] | null> {
    
       let response=await TodoModal.find({workspaceId,folderId,listId,taskId})

       

       if(response){
        let responseData:TodoType[]=response.map((todo)=>{
          return{
              id: todo._id.toString() as string,
              workspaceId: todo.workspaceId.toString() as string,
              folderId: todo.folderId.toString() as string,
              listId: todo.listId.toString() as string,
              taskId:todo.taskId.toString() as string,
              todo:todo.todo ,
              assignee: todo.assignee? todo.assignee.toString() : '',
              todo_status:todo.todo_status,
              createdAt: moment(todo.createdAt).format("MMMM D, YYYY - h:mm A"),
              updatedAt: moment(todo.updatedAt).format("MMMM D, YYYY - h:mm A"),

            }
          
        })

        return responseData
       }
       return null
  }



}
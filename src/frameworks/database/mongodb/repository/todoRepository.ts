
import moment from "moment";
import { TodoType } from "../../../../Entities/Todo";
import { ITodoRepository } from "../../../../Interfaces/ITodoRepository";
import { Todo as TodoModal } from "../models/TodoModal";



export class TodoRepository implements ITodoRepository {
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
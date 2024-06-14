import { User, UserType } from "../../../../Entities/Users";
import { ISearchRepository } from "../../../../Interfaces/ISearchRepository";
import  UserModal from "../models/UserModel";
import { Todo as TodoModal } from "../models/TodoModal";
import { TodoType } from "../../../../Entities/Todo";
import moment from "moment";

export class SearchRepo implements ISearchRepository {
  constructor() {
    
  }
 
  async searchUsers(searchKey:string):Promise<UserType[]|null> {

    let response=await UserModal.find({
      "$or":[
        {userName:{$regex:searchKey}}
      ]
    })

    if(response){
      let responseData:UserType[]=response.map((user)=>({
        id:user._id,
        userName:user.userName,
        email:user.email,
        profile_image:user.profile_image,
        roles:user.roles,
        verified:user.verified,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt
      }))

      return responseData
    }

    return null


    
  }


  async  searchTodo(workspaceId: string, folderId: string, listId: string, taskId: string,todoKey:string): Promise<TodoType[] | null> {
    
    let response=await TodoModal.find({
      "$or":[
        {workspaceId,folderId,listId,taskId,todo:{$regex:todoKey}}
      ]
    })

    

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
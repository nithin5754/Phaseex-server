import { NextFunction, Request, Response } from "express";
import { ISearchService } from "../../Interfaces/ISearchService";





    export class SearchController {
      private searchService:ISearchService
      constructor(searchService:ISearchService) {
        this.searchService=searchService
        
      }


  onSearchUsers= async (req: Request, res: Response, next: NextFunction) => {
    const searchKey=req.params.searchKey

    console.log(searchKey,"search-key....");
    

      if(!searchKey){
        return res.status(404).json({message:"credentials missing please try again later!"})
      }
        try {
          let response=await this.searchService.getSearchUsers(searchKey.toLowerCase())
          if(!response){
            return res.status(400).json({message:"not found"})
          }

          return res.status(200).json(response)
              
        } catch (error) {
          next(error)
        }
  }





    }
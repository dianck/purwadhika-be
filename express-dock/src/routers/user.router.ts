import { Router } from "express";
import { UserController } from "../controllers/user.controller";



export class UserRouter{
    private router :  Router;
    private userController : UserController;

    constructor(){
        this.router = Router();
        this.userController = new UserController();
    }

    private initializeRoutes(){
        this.router.get("/", this.userController.getUsers);        
        
    }

    public getRouter(): Router{
        this.initializeRoutes();
        return this.router;
    }
}
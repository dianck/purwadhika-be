import { Router } from "express";
import { UserController } from "../controllers/user.controllers";

export class UserRouter{
    private router: Router
    private userController: UserController
    
    constructor(){
        this.router = Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get('/', this.userController.getUsers);
        this.router.get("/:id", this.userController.getUserId);
        this.router.post("/", this.userController.createUser);
        this.router.delete("/:id", this.userController.deleteUser);
        this.router.put('/:id', this.userController.editUser);

    }

    getRouter(): Router{
        return this.router;
    }
}
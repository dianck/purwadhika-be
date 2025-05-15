import { Router } from "express";
import { ExpenseController } from "../controllers/expense.controller";

export class ExpenseRouter {
    private router: Router
    private expensController: ExpenseController

    constructor(){
        this.router = Router();
        this.expensController = new ExpenseController();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get('/', this.expensController.getExpense);

        //add another route here
    }

    getRouter(): Router{
        return this.router;
    }
}
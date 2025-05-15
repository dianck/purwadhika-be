import { Router } from "express";
import { ExpenseV2Controller } from "../controllers/expenseV2.controller";

export class ExpenseV2Router {
    private router: Router;
    private expenseV2Controller: ExpenseV2Controller;

    constructor() {
        this.router = Router();
        this.expenseV2Controller = new ExpenseV2Controller();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/", (req, res) => this.expenseV2Controller.getExpense(req, res));
        this.router.get("/:id", (req, res) => this.expenseV2Controller.getExpenseDetails(req, res));
        this.router.post("/", (req, res) => this.expenseV2Controller.createExpense(req, res)); 
        this.router.put("/:id", async (req, res) => {
            await this.expenseV2Controller.updateExpense(req, res);
          });
        this.router.delete("/:id", (req, res) => this.expenseV2Controller.deleteExpense(req, res));
          
    }

    getRouter(): Router {
        return this.router;
    }
}

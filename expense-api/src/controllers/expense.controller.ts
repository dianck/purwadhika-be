import { Request, Response } from "express";
import { IExpense } from "../types/expense";
import fs from "fs";

export class ExpenseController{
    getExpense(req: Request, res: Response){
        const {start, end} = req.query
        let expense: IExpense[] = JSON.parse(
            fs.readFileSync("./data/expense.json", "utf-8")
        );

        expense = expense.filter((item) =>{
            let isValid: boolean = true;
            if(start && end){
                const startDate = new Date(start as string);
                const endDate = new Date(end as string);
                const expenseDate = new Date(item.date);

                isValid = isValid && expenseDate >= startDate && expenseDate<= endDate;
            }
            return isValid;
        });


        const total_expense = expense
            .filter((item) => item.type === "expense")
            .reduce((a, b) => a + b.nominal, 0);

        const total_income = expense
            .filter((item) => item.type === "income")
            .reduce((a, b) => a + b.nominal, 0);


        res.status(200).send({
            message: "Expense Data",
            total_expense,
            total_income,
            expense
        });
    }
}
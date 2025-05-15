// src/controllers/expenseV2.controller.ts
import { Request, Response } from "express";
import pool from "../config/db";
import { IExpense } from "../types/expense";

export class ExpenseV2Controller {
    async getExpense(req: Request, res: Response) {
        console.log(`GET EXPENSE`);
        try {
            const { rows, rowCount } = await pool.query("SELECT * FROM public.expense");
            res.status(200).send({
                message: "Data Expense OK",
                rowCount: rowCount,
                expense: rows,
            });
        } catch (err) {
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }

    async getExpenseDetails(req: Request, res: Response) {
        const { id } = req.params;
        console.log(`GET EXPENSE DETAILS: { id }`);

        try {
            const { rows, rowCount } = await pool.query("SELECT * FROM public.expense WHERE id = $1", [id]);

            if (rowCount === 0) throw { message: "Expense not found" }

            res.status(200).send({
                message: "Expense Detail OK",
                expense: rows[0] ?? null,
            });
        } catch (err) {
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }


    async createExpense(req: Request, res: Response) {
        console.log("CREATE EXPENSE");

        try {
            console.log(req.body);
            const { title, nominal, type, category, date } = req.body;

            const query = `
                INSERT INTO public.expense (title, nominal, type, category, date)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            const values = [title, nominal, type, category, date];

            const { rows } = await pool.query(query, values);
            const newExpense = rows[0];

            res.status(201).send({
                message: "Successfully created expense",
                expense: newExpense,
            });
        } catch (err) {
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }  
    
    async updateExpense(req: Request, res: Response) {
        console.log("UPDATE EXPENSE");
        const { id } = req.params;
    
        try {
            console.log(req.body);
            const { title, nominal, type, category } = req.body;
            const date = new Date(); // Gunakan new Date() untuk objek tanggal saat ini
    
            const query = `
                UPDATE public.expense
                SET title = $1, nominal = $2, type = $3, category = $4, date = $5
                WHERE id = $6
                RETURNING *
            `;
            const values = [title, nominal, type, category, date, id];
    
            const { rows } = await pool.query(query, values);
    
            if (rows.length === 0) {
                return res.status(404).send({ message: "Expense not found" });
            }
    
            const updatedExpense = rows[0];
    
            res.status(200).send({
                message: "Successfully updated expense",
                expense: updatedExpense,
            });
        } catch (err) {
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }

    async deleteExpense(req: Request, res: Response) {
        const { id } = req.params;
        console.log(`DELETE EXPENSE: { id }`);

        try {
            const { rows } = await pool.query("DELETE FROM public.expense WHERE id = $1", [id]);
            res.status(200).send({
                message: "Delete Expense  OK",
                expense: rows[0] ?? null,
            });
        } catch (err) {
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }    


    async getTotalByCategory(req: Request, res: Response) {
        const { category } = req.params;
        console.log(`GET EXPENSE BY CATEGORY: { category }`);

        try {
            const { rows } = await pool.query("SELECT sum(nominal) FROM public.expense WHERE category = $1", [category]);
            res.status(200).send({
                message: `Total Expense ({category}): `,
                expense: rows[0] ?? null,
            });
        } catch (err) {
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }

}


/**
 curl -X POST http://localhost:8000/api/v2/expense \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Beli makan malam",
    "nominal": 50000,
    "type": "expense",
    "category": "food",
    "date": "2025-05-05"
  }'
 
  
curl -X PUT http://localhost:8000/api/v2/expense/5 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Naik gojek",
    "nominal": 15000,
    "type": "expense",
    "category": "transport"
  }'

curl -X GET http://localhost:8000/api/v2/expense/5
curl -X DELETE http://localhost:8000/api/v2/expense/5

 */
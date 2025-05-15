import "dotenv/config"
import express, { Application, Request, Response } from 'express';
import { ExpenseRouter } from './routers/expense.router';
import { ExpenseV2Router } from './routers/expenseV2.router';
import pool from "./config/db";


const PORT: number = 8000;


const app: Application = express();
app.use(express.json())

app.get('/api', (req: Request, res: Response) => {
    res.status(200).send({ message: 'Welcom to My API!' })
});

const expenseRouter =  new ExpenseRouter();
app.use('/api/expense', expenseRouter.getRouter());

const expenseV2Router = new ExpenseV2Router();
app.use('/api/v2/expense', expenseV2Router.getRouter());


pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }

  if(client){
    client.query("set search_path to test", (queryErr) =>{
      if(queryErr){
        console.log("Error connection test", queryErr.stack)
      }else{
        console.log("Success connection test");
        release();
      }
    });
  }

});

app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}/api`);
});




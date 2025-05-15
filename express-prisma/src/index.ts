import express, { Application, Request, Response } from 'express';
import { UserRouter } from './routers/user.router';
import { AuthController } from './controllers/auth.controller';
import { AuthRouter } from './routers/auth.router';

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
    res.status(200).send({ message: "Welcome to my API" });
});

// Perbaikan: Hindari nama variabel yang sama dengan class
const userRouter = new UserRouter();
app.use("/api/users", userRouter.getRouter());


const authRouter = new AuthRouter;
app.use("/api/auth", authRouter.getRouter());

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/api`);
});

import express, { Application, Request, Response } from 'express';
import { UserRouter } from './routers/user.router';

const PORT: number = 8000;
const app: Application = express();
app.use(express.json()); //middleware untuk membaca body request (req.body)

// Endpoint utama
// Perbaiki typo: 'Welcom' → 'Welcome'
app.get('/api', (req: Request, res: Response) => {
  res.status(200).send({ message: 'Welcome to My API!' });
});

// Ganti nama variabel instance agar tidak bentrok dengan nama class
const userRouter = new UserRouter();
app.use('/api/users', userRouter.getRouter());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

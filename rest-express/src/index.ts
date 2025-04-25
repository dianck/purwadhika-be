import express, { Application, Request, Response } from 'express';

const PORT: number = 8000;

const app: Application = express();

app.get('/api', (req: Request, res: Response) => {
    res.status(200).send({ message: 'Welcom to My API!' })
    // res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
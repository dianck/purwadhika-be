import { ResolveOptions } from 'dns';
import express, {Application, Request, Response} from 'express';


const PORT: number = 8000;


const app: Application = express();
app.use(express.json());


app.get("/api", (reg: Request, res: Response) =>{
    res.status(200).send({ message: "Welcome to my API"});
})


app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/api`)
})

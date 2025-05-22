import { Request, Response } from "express";
import prisma from "../prisma";
// import prisma from "../prisma";

export class UserController{

    async getUsers(req: Request, res: Response){
        try{
            // const users = await prisma.user.findMany();
            const users = await prisma.user.findMany();
            res.status(200).send({ users });
        }catch(err){
            console.log(err);
            res.status(400).send({err});
        }
    }

}

/**
 curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Andi4",
    "email": "budi4@gmail.com",
    "password": "123456"
  }'

curl -X GET http://localhost:8000/api/users
curl -X GET http://localhost:8000/api/users/2
curl -X DELETE http://localhost:8000/api/users/2

curl -X PUT http://localhost:8000/api/users/4 \
  -H "Content-Type: application/json" \
  -d '{"username": "Nama Baru 123", "email": "emailbaru123@example.com"}'


curl -X GET http://localhost:8000/api/users/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3MzEwMzI4LCJleHAiOjE3NDczMTM5Mjh9.Cz8Z-wDSdq0IzIINxZhE6kr-uke4XtRJuium47FsJkA" \
  -H "Content-Type: application/json"


*/
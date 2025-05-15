import { Request, Response } from "express";
import prisma from "../prisma";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";


export class AuthController{
    async register(reg: Request, res: Response){
        try{
            const {username, email, password} = reg.body;

            const salt = await  genSalt(10);
            const hashedPassword = await hash(password, salt);

            await prisma.user.create({
                data:{
                    username,
                    email,
                    password: hashedPassword
                }
            });

            res.status(201).send({
                message: "Register OK"
            });
        }catch(err){
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }

    async login(req: Request, res: Response){
        try{
            const {login, password} = req.body;
            const user = await prisma.user.findFirst({
              where: { OR: [{ username: login }, { email: login }]},
              select: {
                id: true,
                username: true,
                email: true,
                password: true,
                avatar: true
              }
            });

            if(!user){
                return res.status(404).send({message: "User not found"});
            }

            const isPasswordValid = await compare(password, user.password);

            if(!isPasswordValid){
                return res.status(401).send({message: "Invalid password"});
            }

            const palyload = {id: user.id, role: "user"};
            const token = sign (palyload, process.env.SECRET_KEY! , {expiresIn: "1"});

            res.status(200).send({
              message: "Login OK",
              user,
              token
            });

          }catch(err){
            console.error("Query error:", err);
            res.status(500).send({ message: "Internal error", error: err });
        }
    }
}


/**
 curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Andi5",
    "email": "budi5@gmail.com",
    "password": "123456"
  }'


 curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "budi5@gmail.com",
    "password": "123456"
  }'

  */
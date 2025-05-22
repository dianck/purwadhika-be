import { Request, Response } from "express";
import prisma from "../prisma";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
import { transporter } from "../helpers/mailer";


export class AuthController{
  async register(req: Request, res: Response) {
      try {
        const { username, email, password } = req.body;
    
        if (!username || !email || !password) {
          res.status(400).send({ message: "All fields are required" });
          return; 
        }
    
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          res.status(409).send({ message: "Email already registered" });
          return;
        }
    
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
    
        const user = await prisma.user.create({
          data: {
            username,
            email,
            password: hashedPassword
          }
        });
    
        //token untuk regustrasi
        const payload = { id: user.id };
        const token = sign(payload, process.env.SECRET_KEY_VERIFY!, { expiresIn: "10m" });
    
        const expiredAt = new Date (Date.now() + 10 * 60 * 1000)
        await prisma.email_verifications.create({
            data: {userId: user.id, token, expiredAt},
        });

        const templatePath = path.join(__dirname, "../templates", "verify.hbs");
        if (!fs.existsSync(templatePath)) {
          res.status(500).send({ message: "Email template not found" });
          return;
        }
    
        const templateSource = fs.readFileSync(templatePath, "utf-8");
        const compiledTemplate = Handlebars.compile(templateSource);
        const html = compiledTemplate({
          username: user.username,
          link: `http://localhost:3000/verify?token=${token}`
        });
    
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: user.email,
          subject: "Verify Email",
          html,
        });
    
        res.status(201).send({ message: "Register OK" });
      } catch (err) {
        console.error("Register error:", err);
        res.status(500).send({ message: "Internal server error", error: err });
      }
    }
  

    async login(req: Request, res: Response) {
      try {
        const { login, password } = req.body;
  
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: login },
              { email: login }
            ]
          },
          select: {
            id: true,
            username: true,
            email: true,
            password: true,
            avatar: true
          }
        });
  
        if (!user) {
          res.status(404).send({ message: "User not found" });
          return;
        }
  
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
          res.status(401).send({ message: "Invalid password" });
          return;
        }
  
        const payload = { id: user.id, role: "user" };
        const token = sign(payload, process.env.SECRET_KEY!, { expiresIn: "1h" });
  
        // Hapus password dari response
        const { password: _, ...userWithoutPassword } = user;
  
        res.status(200).send({
          message: "Login OK",
          user: userWithoutPassword,
          token
        });
  
      } catch (err) {
        console.error("Query error:", err);
        res.status(500).send({ message: "Internal error", error: err });
      }
    }


    async verify(req: Request, res: Response){
      try{
        const { id } = res.locals?.user;
        const token  = res.locals?.token;

        const data = await prisma.email_verifications.findFirst({
          where: {token, userId: id},
        })

        if(!data) throw {message: "Invalid link verification "};

        await prisma.user.update({
          data: {isVerified: true},
          where: {id},
        })

        await prisma.email_verifications.delete({
          where: {id: data.id}
        });

        res.status(200).send({message: "Verification Successfully"});

      }catch(err){
        console.log(err);
        res.status(400).send(err);
      }
    }

}


/**
 curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Soqi",
    "email": "sogilu@logsmarter.net",
    "password": "Asd@123456"
  }'


 curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "budi5@gmail.com",
    "password": "123456"
  }'



   curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Andi6",
    "email": "budi6@gmail.com",
    "password": "asd123456"
  }'
  */
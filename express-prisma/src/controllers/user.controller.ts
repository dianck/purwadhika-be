import { Request, Response } from "express";
import prisma from "../prisma";

export class UserController{
    async createUser(req: Request, res: Response){
        try{
            const {username, email, password} = req.body;
            await prisma.user.create({data: {username, email, password}});
            res.status(200).send({message: "User created successfully"}); 
        }catch(err){
            console.log(err);
            res.status(400).send({err});
        }
    }

    async getUsers(req: Request, res: Response){
        try{
            const users = await prisma.user.findMany();
            res.status(200).send({
                message: "Data User",
                users
            });
        }catch(err){
            console.log(err);
            res.status(400).send({err});
        }
    }

    async getUserById(req: Request, res: Response){
        const { id } = req.params;
        try{
            const user = await prisma.user.findFirst({ where: { id: Number(id) } });
            res.status(200).send({
                message: "Data User",
                user
            });
        }catch(err){
            console.log(err);
            res.status(400).send({err});
        }
    }

    async deleteUser(req: Request, res: Response) {
        const { id } = req.params;
        const userId = Number(id);
    
        if (isNaN(userId)) {
            return res.status(400).json({ message: "ID tidak valid" });
        }
    
        try {
            const user = await prisma.user.delete({
                where: { id: userId },
            });
    
            return res.status(200).json({
                message: "User berhasil dihapus",
                user,
            });
        } catch (error: any) {
            console.error("Gagal menghapus user:", error);
    
            // Tangani kasus user tidak ditemukan (prisma throw error)
            if (error.code === 'P2025') {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }
    
            return res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
        }
    }
    
    async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const userId = Number(id);
    
        if (isNaN(userId)) {
            return res.status(400).json({ message: "ID tidak valid" });
        }
    
        const { username, email } = req.body;
    
        if (!username && !email) {
            return res.status(400).json({ message: "Tidak ada data yang diberikan untuk di-update" });
        }
    
        try {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(username && { username }),
                    ...(email && { email }),
                },
            });
    
            return res.status(200).json({
                message: "User berhasil diupdate",
                user: updatedUser,
            });
        } catch (error: any) {
            console.error("Gagal mengupdate user:", error);
    
            if (error.code === 'P2025') {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }
    
            return res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
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
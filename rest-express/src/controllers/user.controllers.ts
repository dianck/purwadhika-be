import { Request, Response } from "express";
import fs from "fs";
import { IUser } from "../types/user";

export class UserController {
    getUsers(req: Request, res: Response) {
        const users: IUser[] = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        res.status(200).send({
            message: "Data Users",
            users,
        });

    }

    getUserId(req: Request, res: Response) {
        const { id } = req.params;
        const users: IUser[] = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));

        const user: IUser | undefined = users.find(item => item.id == Number(id));

        if(!user){
            res.status(400).send({
                message: `Data User dengan ID ${id} tidak ditemukan`
            })
            return;
        }
        res.status(200).send({
            message: `Data User dengan ID ${id}`,
            user
        })
    }

    createUser(req: Request, res: Response) {
        console.log("CREATE USER");
        console.log(req.body);
        const users: IUser[] = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        const maxId: number = Math.max(...users.map( (item) => item.id));
        const id = users.length === 0 ? 1 : maxId + 1;
        const {name, email} = req.body;
        const newUser: IUser = {
            id,
            name,
            email
        }
        users.push(newUser);
        console.log(users);

        fs.writeFileSync("./data/users.json", JSON.stringify(users),"utf-8");

        res.status(201).send({
            message: "Successfully create User",
            user: newUser,
        })
    }

    deleteUser(req: Request, res: Response){
        const {id} = req.params;
        console.log("DELETE USER");
        console.log(`Data User dengan ID ${id} berhasil dihapus`);
        
        const users: IUser[] = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        const userIndex: number = users.findIndex(item => item.id == Number(id));
        if(userIndex === -1){
            res.status(400).send({
                message: `Data User dengan ID ${id} tidak ditemukan`
            })
            return;
        }
        users.splice(userIndex, 1);
        fs.writeFileSync("./data/users.json", JSON.stringify(users),"utf-8");
        res.status(200).send({
            message: `Data User dengan ID ${id} berhasil dihapus`
        })
    }

    editUser(req: Request, res: Response){
        const {id} = req.params;
        console.log("EDIT USER");
        console.log(req.body);
        const users: IUser[] = JSON.parse(fs.readFileSync("./data/users.json", "utf-8"));
        const user: IUser | undefined = users.find(item => item.id == Number(id));
        if(!user){
            res.status(400).send({
                message: `Data User dengan ID ${id} tidak ditemukan`
            })
            return;
        }
        const {name, email} = req.body;
        user.name = name;
        user.email = email;
        fs.writeFileSync("./data/users.json", JSON.stringify(users),"utf-8");
        res.status(200).send({
            message: `Data User dengan ID ${id} berhasil diedit`
        })
    }
    
}   
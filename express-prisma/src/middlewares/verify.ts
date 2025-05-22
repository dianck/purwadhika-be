
import { NextFunction, Request, Response } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";

export const verifyToken = (reg: Request, res: Response, next: NextFunction) => {
    const token = reg.headers.authorization?.split(" ")[1]; // "Bearer kjdfsak" -> [Bearer, kjdfsak]

    if(!token){
        res.status(401).send({message: "Unauthorized"});
        return;
    }

    verify(token, process.env.SECRET_KEY!, (err, palyload) => {
        if(err){
            if(err instanceof TokenExpiredError){
                res.status(401).send({message: "Token expired"});
            }else{
                res.status(401).send({message: "Unauthorized"});
            }

            return
        }
        
        res.locals.user = palyload;
        next();
    });


}


export const verifyTokenVerification = (
    req: Request, 
    res: Response, 
    next: NextFunction
    ) => {
        const token = req.headers.authorization?.split(" ")[1]; // "Bearer kjdfsak" -> [Bearer, kjdfsak]

        if(!token){
            res.status(401).send({message: "Unauthorized"});
            return;
        }

        verify(token, process.env.SECRET_KEY_VERIFY!, (err, palyload) => {
            if(err){
                if(err instanceof TokenExpiredError){
                    res.status(401).send({message: "Token expired"});
                }else{
                    res.status(401).send({message: "Unauthorized"});
                }

                return
            }
            
            res.locals.user = palyload;
            res.locals.token = token;
            next();
        });


};
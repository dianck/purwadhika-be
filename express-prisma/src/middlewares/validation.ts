import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateRegister = [
    body("username").notEmpty().withMessage("Username is required"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),
    
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
        // .isStrongPassword({minLength:6, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1})
        // .withMessage("Password must contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
];

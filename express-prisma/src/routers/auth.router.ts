import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRegister } from "../middlewares/validation";
import { verifyTokenVerification } from "../middlewares/verify from";

export class AuthRouter {
  private readonly router: Router;
  private readonly authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/register", validateRegister, this.authController.register);
    this.router.post("/login", this.authController.login);

    this.router.patch(
      "/verify", 
      verifyTokenVerification, 
      this.authController.verify)

  }

  public getRouter(): Router {
    return this.router;
  }
}

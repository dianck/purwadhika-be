import { Router } from "express";
import { PostController } from "../controllers/post.controller";

export class PostRouter {
  private router: Router;
  private postController: PostController;

  constructor() {
    this.router = Router();
    this.postController = new PostController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.postController.getPosts);
  }

  getRouter(): Router {
    return this.router;
  }
}
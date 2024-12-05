import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controller/user.controller";

export class UserRouter {
  private userController: UserController;
  private router: Router;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.userController.getUser);
    this.router.post("/", this.userController.createUser);


    this.router.get("/:user_id",this.userController.getUserId)
    this.router.patch("/:user_id", this.userController.editUser);
    this.router.delete("/:user_id",this.userController.deleteUser)
  }

  getRouter(): Router {
    return this.router;
  }
}

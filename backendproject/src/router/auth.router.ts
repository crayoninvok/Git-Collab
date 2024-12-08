import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { verifyToken } from "../middleware/verify";
import { verifyTokenPromotor } from "../middleware/verify.promotor";

export class AuthRouter {
  private authController: AuthController;
  private router: Router;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //FOR USER // Nanti buatlagi /protected untuk route pembayaran
   this.router.post("/login",verifyToken, this.authController.loginUser)
   this.router.post("/register", this.authController.registerUser)

   //FOR PROMOTOR
   this.router.post("/promotorRegister", this.authController.registerPromotor)
   this.router.post("/promotorLogin", verifyTokenPromotor, this.authController.loginPromotor)
  }

  public getRouter(): Router {
    return this.router;
  }
}

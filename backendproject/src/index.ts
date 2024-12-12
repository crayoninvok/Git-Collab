import express from "express";
import cookieParser from "cookie-parser";
import { AuthRouter } from "./router/auth.router"; // Import the AuthRouter class
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { UserRouter } from "./router/user.router";
dotenv.config(); 

const PORT: number = 8000;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true, 
  })
);

const authRouter = new AuthRouter();
const userRouter = new UserRouter()

app.use("/api/auth", authRouter.getRouter());
app.use("/api/users",userRouter.getRouter())

// Test route
app.get("/api", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on -> http://localhost:${PORT}/api`);
});

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUser } from "../services/user.service"; // Import the user service

export class AuthController {
  async loginUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      // Perform login logic
      res.status(200).send("Login Successful");
    } catch (err) {
      console.error(err);
      res.status(400).send("Login Failed");
    }
  }

  async registerUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      // Perform registration logic
      res.status(201).send("Registration Successful");
    } catch (err) {
      console.error(err);
      res.status(400).send("Registration Failed");
    }
  }
}

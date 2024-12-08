import { Request, Response } from "express";
import prisma from "../prisma";
import { genSalt, hash, compare } from "bcrypt";
import { findUser} from "../services/user.service";
import { findPromotor } from "../services/find.promotor";
import { sign, verify } from "jsonwebtoken";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { generateReferalCode } from "../utils/generateReferalCode";
import { transporter } from "../services/mailer";

export class AuthController {
  async loginUser(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const user = await findUser(data, data);

      if (!user) throw { massage: "Account not found !" };
      if (!user.isVerify) throw { massage: "Account not Verif !" };

      const isValidPass = await compare(password, user.password);
      if (!isValidPass) {
        throw { massage: "Incorrect Password" };
      }

      const payload = { id: user.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });

      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 3600 * 1000,
          path: "/",
          secure: process.env.NODE_ENV === 'production'
        })
        .send({ massage: "Login Succesfully", user });
    } catch (err) {
      console.error(err);
      res.status(400).send("Login Failed");
    }
  }

  //Belom Beres tapi udah jalan
  async registerUser(req: Request, res: Response) {
    try {
      const { username, email, password, confirmPassword } = req.body;
      if (password != confirmPassword)
        throw { massage: "Password Not Match !" };

      const user = await findUser(username, email);
      if (user) throw { massage: "Username or Email has been used" };

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashPassword,
          refCode: generateReferalCode()
        },
      });

      const payload = { id: newUser.id };

      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });
      const link = `http://localhost:3000/verify${token}`;

      const templatePath = path.join(__dirname,"../templates","verify.hbs")
      const templateSource = fs.readFileSync(templatePath, "utf-8")
      const compiledTemplate = handlebars.compile(templateSource)
      const html = compiledTemplate({username, link})

      await transporter.sendMail({
        from:"dattariqf@gmail.com",
        to:email,
        subject: "Welcome To TIKO",
        html
      })

      res.status(201).send("Registration Successful");
    } catch (err) {
      console.error(err);
      res.status(400).send("Registration Failed");
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const verifiedUser: any = verify(token, process.env.JWT_KEY!);
      await prisma.user.update({
        data: { isVerify: true },
        where: { id: verifiedUser.id },
      });
      res.status(200).send({ massage: "Verified Succes" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  
  async registerPromotor(req: Request, res: Response) {
    try {
      const { name, email, password, confirmPassword } = req.body;
      if (password != confirmPassword)
        throw { massage: "Password Not Match !" };

      const promotor = await findPromotor(name, email)
      if (promotor) throw { massage: "Name or Email has been used" };

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const newUser = await prisma.promotor.create({
        data: {
          name,
          email,
          password: hashPassword,
        },
      });

      const payload = { id: newUser.id };

      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });
      const link = `http://localhost:3000/verify${token}`;

      res.status(201).send("Registration Successful");
    } catch (err) {
      console.error(err);
      res.status(400).send("Registration Failed");
    }
  }

  async loginPromotor(req: Request, res: Response) {
    try {
      const { data, password } = req.body;
      const promotor = await findPromotor(data, data);

      if (!promotor) throw { massage: "Promotor not found !" };
      if (!promotor.isVerify) throw { massage: "Promotor not Verif !" };

      const isValidPass = await compare(password, promotor.password);
      if (!isValidPass) {
        throw { massage: "Incorrect Password" };
      }

      const payload = { id: promotor.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });

      res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 3600 * 1000,
          path: "/",
        })
        .send({ massage: "Login Promotor Succesfully" });
    } catch (err) {
      console.error(err);
      res.status(400).send("Login Failed");
    }
  }


}
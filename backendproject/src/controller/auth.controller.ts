import { Request, Response } from "express";
import prisma from "../prisma";
import { genSalt, hash, compare } from "bcrypt";
import { findUser } from "../services/user.service";
import { sign, verify } from "jsonwebtoken";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { generateReferalCode } from "../utils/generateReferalCode";
import { transporter } from "../services/mailer";
import { findPromotor } from "../services/promotor.service";
import { addMonths } from "date-fns";

export class AuthController {
  //Login User

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
          secure: process.env.NODE_ENV === "production",
        })
        .send({ massage: "Login Succesfully", user });
    } catch (err) {
      console.error(err);
      res.status(400).send("login fail please check again");
    }
  }

  //Register User

  async registerUser(req: Request, res: Response) {
    try {
      const { username, email, password, confirmPassword, refCode } = req.body;

      if (password !== confirmPassword)
        throw { message: "Passwords do not match!" };

      const user = await findUser(username, email);
      if (user) throw { message: "Username or email has already been used" };

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const newUserData: any = {
        username,
        email,
        password: hashPassword,
        refCode: generateReferalCode(),
      };

      // Cek si Reveral Code nya
      if (refCode) {
        const referer = await prisma.user.findUnique({
          where: { refCode },
        });
        if (!referer) throw { message: "Invalid referral code" };

        //plus point jika si reveral dipakai
        await prisma.user.update({
          where: { id: referer.id },
          data: { points: { increment: 10000 } },
        });

        // persentase si kupon jika dipakai
        const coupon = await prisma.userCoupon.create({
          data: {
            percentage: 10,
            isRedeem: false,
            expiredAt: addMonths(new Date(), 3),
          },
        });

        newUserData.userCouponId = coupon.id;
        newUserData.refCodeBy = referer.id;
        //log untuk melihat hasil si referal dari siapa
        await prisma.refLog.create({
          data: {
            pointGet: 10000,
            expiredAt: addMonths(new Date(), 3),
            isUsed: false,
            user: {
              connect: { id: referer.id },
            },
          },
        });
      }

      // buat user baru dari hasil data
      const newUser = await prisma.user.create({ data: newUserData });

      const payload = { id: newUser.id };
      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });
      const link = `http://localhost:3000/verify/${token}`;

      const templatePath = path.join(__dirname, "../templates", "verify.hbs");
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        username,
        link,
        refCode: newUser.refCode,
      });

      // Mailer transport
      await transporter.sendMail({
        from: "dattariqf@gmail.com",
        to: email,
        subject: "Welcome To TIKO",
        html,
      });

      res.status(201).send("Registration Successful");
    } catch (err: any) {
      console.error(err.message || err);
      res.status(400).send(err.message || "Registration Failed");
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////   PROMOTOR   /////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async registerPromotor(req: Request, res: Response) {
    try {
      const { name, email, password, confirmPassword } = req.body;
      if (password != confirmPassword)
        throw { massage: "Password Not Match !" };

      const promotor = await findPromotor(name, email);
      if (promotor) throw { massage: "Name or Email has been used" };

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      const newPromotor = await prisma.promotor.create({
        data: {
          name,
          email,
          password: hashPassword,
        },
      });

      const payload = { id: newPromotor.id };

      const token = sign(payload, process.env.JWT_KEY!, { expiresIn: "1d" });
      const link = `http://localhost:3000/verify${token}`;

      const templatePath = path.join(__dirname, "../templates", "verify.hbs");
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ name, link });

      await transporter.sendMail({
        from: "dattariqf@gmail.com",
        to: email,
        subject: "Welcome To TIKO",
        html,
      });

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

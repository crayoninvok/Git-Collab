import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UserPayload } from "../custom";

export const verifyTokenPromotor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    if (!token) throw { message: "Unauthorize!" };
    console.log(token);

    const verifiedPromotor = verify(token, process.env.JWT_KEY!);

    req.promotor = verifiedPromotor as UserPayload;

    next();
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

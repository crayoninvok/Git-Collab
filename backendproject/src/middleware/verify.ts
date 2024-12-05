import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

// Define the expected structure of the JWT payload
interface UserPayload {
  id: string;
  role: string;
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token; // Extract token from cookies
    if (!token) throw new Error("Unauthorized");

    // Verify the token
    const verifiedUser = verify(token, process.env.JWT_KEY!) as UserPayload;

    // Attach the verified user to the request object
    (req as any).user = verifiedUser;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

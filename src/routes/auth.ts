import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const authSecret = process.env.AUTH_SECRET || "randomstring";
import {z} from "zod"

const user = z.object({
    name:z.string().min(3),
    email:z.string().email(),
    password:z.string().min(5),
})

const userValidation = (req:Request,res:Response,next:NextFunction) =>{
    const { name, email, password} = req.body;
    const validationResult = user.safeParse({name,email,password});
    if(validationResult.success){
        next();
    }
    else{
        res.status(400).json({message:"You have not entered the required fields or it is not meeting crieteria"})
    }
}

router.post(
  "/register",
  userValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      res.status(201).json({ message: "User registered successfully" });
      const token = jwt.sign({ userId: user.id }, authSecret, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (error) {}
    res.status(400).json({ error: "Unable to register user" });
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        console.log("User not found");
      }
      const passwordCompare = await bcrypt.compare(password, user!.password);
      if (passwordCompare) {
        const token = jwt.sign({ userId: user!.id }, authSecret, {
          expiresIn: "1h",
        });
        res.json({ token });
      }
      console.log("Logged in")
      
    } catch (error) {
      res.status(400).json({ error: "Unable to login" });
    }
  }
);

export default router;

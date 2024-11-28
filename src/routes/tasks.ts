import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware/authmiddleware";
import {z} from "zod"
const prisma = new PrismaClient();
const router = express.Router();


const task = z.object({
    title:z.string().min(3),
    description:z.string().min(3),

})

const taskValidation = (req:Request,res:Response,next:NextFunction) =>{
    const { title, description} = req.body;
    const validationResult = task.safeParse({title,description});
    if(validationResult.success){
        next();
    }
    else{
        res.status(400).json({message:"You have not entered the required fields or it is not meeting crieteria"})
    }

}

router.post(
  "/createTask",
  taskValidation,
  authenticate,
  async (req: Request, res: Response) => {
    const { title, description, status } = req.body;
    const userId = req.headers["userId"] as string;
    try {
      const task = await prisma.task.create({
        data: {
          title: title,
          description: description,
          status: status || "PENDING",
          userId: userId as string,
        },
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: "da" });
      console.log(error);
    }
  }
);

router.get("/gettasks", authenticate, async (req, res) => {
  const userId = req.headers["userId"] as string;
  try {
    const tasks = await prisma.task.findMany({ where: { userId } });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: "Unable to fetch tasks" });
  }
});

router.put("/updatetask/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status,
      },
    });
    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Unable to update task" });
  }
});

router.delete("/deletetask/:taskId", async (req, res) => {
  const { taskId } = req.params;
  try {
    await prisma.task.delete({ where: { id: taskId } });
    res.status(204).send({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Unable to delete task" });
  }
});

router.patch("/updatestatus/:taskId", async (req, res) => {
  const { taskId } = req.params;
  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status: "COMPLETED" },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: "Unable to Change status" });
  }
});

export default router;

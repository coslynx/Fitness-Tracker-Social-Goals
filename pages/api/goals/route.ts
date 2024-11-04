import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      return handleGetGoals(req, res);
    case "POST":
      return handleCreateGoal(req, res);
    case "PUT":
      return handleUpdateGoal(req, res);
    case "DELETE":
      return handleDeleteGoal(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function handleGetGoals(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.session?.user?.id; 
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const goals = await prisma.goal.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return res.status(200).json(goals);
}

async function handleCreateGoal(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, target } = req.body;

  if (!title || !target) {
    return res.status(400).json({ message: "Missing title or target" });
  }

  const newGoal = await prisma.goal.create({
    data: {
      title,
      target,
      userId
    }
  });

  return res.status(201).json(newGoal);
}

async function handleUpdateGoal(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { goalId } = req.query;

  if (!goalId) {
    return res.status(400).json({ message: "Missing goalId" });
  }

  const { title, target } = req.body;

  if (!title || !target) {
    return res.status(400).json({ message: "Missing title or target" });
  }

  const goal = await prisma.goal.update({
    where: {
      id: parseInt(goalId as string),
      userId
    },
    data: {
      title,
      target
    }
  });

  return res.status(200).json(goal);
}

async function handleDeleteGoal(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { goalId } = req.query;

  if (!goalId) {
    return res.status(400).json({ message: "Missing goalId" });
  }

  await prisma.goal.delete({
    where: {
      id: parseInt(goalId as string),
      userId
    }
  });

  return res.status(204).json({});
}
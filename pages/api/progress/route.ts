import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

// Import the API client for making requests to other endpoints
import apiClient from "../../../../lib/api/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const userId = req.session?.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (method) {
    case "GET":
      return handleGetActivities(req, res);
    case "POST":
      return handleCreateActivity(req, res);
    case "PUT":
      return handleUpdateActivity(req, res);
    case "DELETE":
      return handleDeleteActivity(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function handleGetActivities(req: NextApiRequest, res: NextApiResponse) {
  const { goalId, startDate, endDate } = req.query;

  const where: any = { userId };

  if (goalId) {
    where.goalId = parseInt(goalId as string);
  }

  if (startDate && endDate) {
    where.date = { gte: new Date(startDate as string), lte: new Date(endDate as string) };
  }

  const activities = await prisma.activity.findMany({
    where,
    orderBy: {
      date: "desc",
    },
  });

  return res.status(200).json(activities);
}

async function handleCreateActivity(req: NextApiRequest, res: NextApiResponse) {
  const { type, date, duration, goalId } = req.body;

  if (!type || !date || !duration || !goalId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newActivity = await prisma.activity.create({
      data: {
        type,
        date: new Date(date),
        duration,
        goalId,
        userId,
      },
    });

    return res.status(201).json(newActivity);
  } catch (error) {
    console.error("Error creating activity:", error);
    return res.status(500).json({ message: "Failed to create activity" });
  }
}

async function handleUpdateActivity(req: NextApiRequest, res: NextApiResponse) {
  const { activityId } = req.query;

  if (!activityId) {
    return res.status(400).json({ message: "Missing activityId" });
  }

  const { type, date, duration, goalId } = req.body;

  if (!type || !date || !duration || !goalId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedActivity = await prisma.activity.update({
      where: {
        id: parseInt(activityId as string),
        userId,
      },
      data: {
        type,
        date: new Date(date),
        duration,
        goalId,
      },
    });

    return res.status(200).json(updatedActivity);
  } catch (error) {
    console.error("Error updating activity:", error);
    return res.status(500).json({ message: "Failed to update activity" });
  }
}

async function handleDeleteActivity(req: NextApiRequest, res: NextApiResponse) {
  const { activityId } = req.query;

  if (!activityId) {
    return res.status(400).json({ message: "Missing activityId" });
  }

  try {
    await prisma.activity.delete({
      where: {
        id: parseInt(activityId as string),
        userId,
      },
    });

    return res.status(204).json({});
  } catch (error) {
    console.error("Error deleting activity:", error);
    return res.status(500).json({ message: "Failed to delete activity" });
  }
}
"use client";

import { jest } from "@jest/globals";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, screen, fireEvent } from "@testing-library/react";
import { Goal } from "@/types";
import { Activity } from "@/types";
import { apiClient } from "@/lib/api/client";
import { useGoalsStore } from "@/store";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("GoalService", () => {
  it("should fetch goals successfully for a given user ID", async () => {
    const userId = 1;
    const mockGoals: Goal[] = [
      {
        id: 1,
        title: "Lose 10 lbs",
        target: "150 lbs",
        userId: 1,
        createdAt: new Date(),
      },
      {
        id: 2,
        title: "Run 5km daily",
        target: "30 minutes",
        userId: 1,
        createdAt: new Date(),
      },
    ];

    server.use(
      rest.get("/goals", (req, res, ctx) => {
        return res(ctx.json(mockGoals));
      })
    );

    render(<div />);

    const goals = await apiClient.getGoals(userId);

    expect(goals).toBeDefined();
    expect(goals.length).toBeGreaterThanOrEqual(2);
    expect(goals).toEqual(mockGoals);
  });

  it("should handle errors gracefully during API calls", async () => {
    const userId = 1;
    server.use(
      rest.get("/goals", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<div />);

    try {
      await apiClient.getGoals(userId);
    } catch (error) {
      console.error("Error fetching goals:", error);
      expect(error).toBeDefined();
    }
  });

  it("should create a new goal successfully", async () => {
    const newGoal: Goal = {
      title: "New Goal",
      target: "New Target",
      userId: 1,
      createdAt: new Date(),
    };

    server.use(
      rest.post("/goals", (req, res, ctx) => {
        return res(ctx.json(newGoal));
      })
    );

    render(<div />);

    const createdGoal = await apiClient.createGoal(newGoal);

    expect(createdGoal).toBeDefined();
    expect(createdGoal.title).toBe("New Goal");
    expect(createdGoal.target).toBe("New Target");
  });

  it("should update an existing goal successfully", async () => {
    const updatedGoal: Goal = {
      id: 1,
      title: "Updated Goal Title",
      target: "Updated Goal Target",
      userId: 1,
      createdAt: new Date(),
    };

    server.use(
      rest.put("/goals/:id", (req, res, ctx) => {
        const goalId = parseInt(req.params.id);
        return res(ctx.json(updatedGoal));
      })
    );

    render(<div />);

    const updated = await apiClient.updateGoal(updatedGoal);
    expect(updated).toBeDefined();
    expect(updated.title).toBe("Updated Goal Title");
    expect(updated.target).toBe("Updated Goal Target");
  });

  it("should delete a goal successfully", async () => {
    const goalId = 1;

    server.use(
      rest.delete("/goals/:id", (req, res, ctx) => {
        const id = parseInt(req.params.id);
        return res(ctx.status(204));
      })
    );

    render(<div />);

    await apiClient.deleteGoal(goalId);
  });
});

describe("ActivityService", () => {
  it("should fetch activities successfully for a given user ID", async () => {
    const userId = 1;
    const mockActivities: Activity[] = [
      {
        id: 1,
        type: "Running",
        date: new Date("2023-10-26"),
        duration: 30,
        goalId: 1,
        userId: 1,
      },
      {
        id: 2,
        type: "Cycling",
        date: new Date("2023-10-25"),
        duration: 45,
        goalId: 2,
        userId: 1,
      },
    ];

    server.use(
      rest.get("/progress", (req, res, ctx) => {
        return res(ctx.json(mockActivities));
      })
    );

    render(<div />);

    const activities = await apiClient.getActivities(userId);

    expect(activities).toBeDefined();
    expect(activities.length).toBeGreaterThanOrEqual(2);
    expect(activities).toEqual(mockActivities);
  });

  it("should create a new activity successfully", async () => {
    const newActivity: Activity = {
      type: "Walking",
      date: new Date("2023-10-27"),
      duration: 40,
      goalId: 1,
      userId: 1,
    };

    server.use(
      rest.post("/progress", (req, res, ctx) => {
        return res(ctx.json(newActivity));
      })
    );

    render(<div />);

    const createdActivity = await apiClient.createActivity(newActivity);

    expect(createdActivity).toBeDefined();
    expect(createdActivity.type).toBe("Walking");
    expect(createdActivity.duration).toBe(40);
  });

  it("should update an existing activity successfully", async () => {
    const updatedActivity: Activity = {
      id: 1,
      type: "Running",
      date: new Date("2023-10-26"),
      duration: 50,
      goalId: 1,
      userId: 1,
    };

    server.use(
      rest.put("/progress/:id", (req, res, ctx) => {
        const activityId = parseInt(req.params.id);
        return res(ctx.json(updatedActivity));
      })
    );

    render(<div />);

    const updated = await apiClient.updateActivity(updatedActivity);
    expect(updated).toBeDefined();
    expect(updated.duration).toBe(50);
  });

  it("should delete an activity successfully", async () => {
    const activityId = 1;

    server.use(
      rest.delete("/progress/:id", (req, res, ctx) => {
        const id = parseInt(req.params.id);
        return res(ctx.status(204));
      })
    );

    render(<div />);

    await apiClient.deleteActivity(activityId);
  });
});
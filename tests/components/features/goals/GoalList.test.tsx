"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { GoalList } from "@/components/features/goals/GoalList";
import { Goal } from "@/types";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { useGoalsStore } from "@/store";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/goals", (req, res, ctx) => {
    return res(
      ctx.json([
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
      ])
    );
  }),
  rest.put("/goals/:id", (req, res, ctx) => {
    const goalId = parseInt(req.params.id);
    const updatedGoal = req.body as Goal;
    return res(ctx.json(updatedGoal));
  }),
  rest.delete("/goals/:id", (req, res, ctx) => {
    const goalId = parseInt(req.params.id);
    return res(ctx.status(204));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("GoalList", () => {
  beforeEach(() => {
    useGoalsStore.setState({ user: { id: 1, email: "test@example.com" } });
  });

  it("should render a list of goals with the correct details", async () => {
    render(<GoalList />);

    const goalTitles = await screen.findAllByRole("heading", {
      level: 3,
    });
    expect(goalTitles).toHaveLength(2);
    expect(goalTitles[0]).toHaveTextContent("Lose 10 lbs");
    expect(goalTitles[1]).toHaveTextContent("Run 5km daily");
  });

  it("should open the edit modal when the Edit button is clicked", async () => {
    render(<GoalList />);
    const editButton = await screen.findByRole("button", {
      name: "Edit",
    });
    fireEvent.click(editButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should open the delete modal when the Delete button is clicked", async () => {
    render(<GoalList />);
    const deleteButton = await screen.findByRole("button", {
      name: "Delete",
    });
    fireEvent.click(deleteButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should validate input fields in the edit modal", async () => {
    render(<GoalList />);
    const editButton = await screen.findByRole("button", {
      name: "Edit",
    });
    fireEvent.click(editButton);
    const titleInput = screen.getByRole("textbox", { name: "edit-title" });
    const targetInput = screen.getByRole("textbox", { name: "edit-target" });

    // Test validation rules (e.g., required fields)
    fireEvent.change(titleInput, { target: { value: "" } });
    fireEvent.change(targetInput, { target: { value: "" } });

    const saveButton = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveButton);
    expect(screen.getByText("Please enter both title and target")).toBeInTheDocument();
  });

  it("should fetch and render goals from the API", async () => {
    render(<GoalList />);

    const goalTitles = await screen.findAllByRole("heading", {
      level: 3,
    });
    expect(goalTitles).toHaveLength(2);
    expect(goalTitles[0]).toHaveTextContent("Lose 10 lbs");
    expect(goalTitles[1]).toHaveTextContent("Run 5km daily");
  });

  it("should handle errors during API calls gracefully", async () => {
    server.use(
      rest.get("/goals", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<GoalList />);

    // Assertions to verify that the component displays an error message
    expect(screen.getByText("Failed to fetch goals")).toBeInTheDocument();
  });

  it("should update the goal in the store and UI when the Save button is clicked", async () => {
    const updatedGoal: Goal = {
      id: 1,
      title: "New Goal Title",
      target: "New Goal Target",
      userId: 1,
      createdAt: new Date(),
    };

    render(<GoalList />);

    // Open the edit modal
    const editButton = await screen.findByRole("button", {
      name: "Edit",
    });
    fireEvent.click(editButton);

    // Update input fields
    const titleInput = screen.getByRole("textbox", { name: "edit-title" });
    const targetInput = screen.getByRole("textbox", { name: "edit-target" });
    fireEvent.change(titleInput, { target: { value: updatedGoal.title } });
    fireEvent.change(targetInput, { target: { value: updatedGoal.target } });

    // Click Save button
    const saveButton = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveButton);

    // Verify goal is updated in the UI
    expect(screen.getByText(updatedGoal.title)).toBeInTheDocument();
    expect(screen.getByText(updatedGoal.target)).toBeInTheDocument();
  });

  it("should delete the goal from the store and UI when the Delete button is clicked", async () => {
    render(<GoalList />);

    // Open the delete modal
    const deleteButton = await screen.findByRole("button", {
      name: "Delete",
    });
    fireEvent.click(deleteButton);

    // Click Delete button in the modal
    const deleteModalButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteModalButton);

    // Verify goal is no longer in the UI
    expect(screen.queryByText("Lose 10 lbs")).not.toBeInTheDocument();
  });
});
"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DashboardPage } from "@/pages/dashboard/page"; // Assuming your page component is at this location
import { apiClient } from "@/lib/api/client"; // Assuming your API client is at this location
import { Goal } from "@/types"; // Assuming your Goal interface is at this location
import { Activity } from "@/types"; // Assuming your Activity interface is at this location
import { useStore } from "@/store"; // Assuming your Zustand store is at this location
import { rest } from "msw"; // For mocking API requests
import { setupServer } from "msw/node"; // For setting up the MSW server

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
  rest.get("/progress", (req, res, ctx) => {
    return res(
      ctx.json([
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
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("DashboardPage", () => {
  beforeEach(() => {
    useStore.setState({
      user: { id: 1, email: "test@example.com" },
      activities: [],
      goals: [],
    });
  });

  it("should render the dashboard with user goals and activity logs", async () => {
    render(<DashboardPage />);

    expect(screen.getByText("Fitness Tracker Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Your Goals")).toBeInTheDocument();
    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(screen.getByText("Progress Overview")).toBeInTheDocument();

    const goalTitles = await screen.findAllByRole("heading", { level: 3 });
    expect(goalTitles).toHaveLength(2);
    expect(goalTitles[0]).toHaveTextContent("Lose 10 lbs");
    expect(goalTitles[1]).toHaveTextContent("Run 5km daily");

    const activityItems = await screen.findAllByRole("listitem");
    expect(activityItems).toHaveLength(2);
    expect(activityItems[0].textContent).toContain("2023-10-26");
    expect(activityItems[1].textContent).toContain("2023-10-25");
  });

  it("should handle API errors gracefully", async () => {
    server.use(
      rest.get("/goals", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<DashboardPage />);

    await screen.findByText("Failed to fetch goals");
  });
});
"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ActivityLog from "@/components/features/progress/ActivityLog";
import { Activity } from "@/types";
import { apiClient } from "@/lib/api/client";
import { getFormattedDate } from "@/lib/utils/formatters";
import { useStore } from "@/store";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get("/progress", (req, res, ctx) => {
    const userId = req.url.searchParams.get("userId");
    if (userId) {
      return res(
        ctx.json([
          {
            id: 1,
            type: "Running",
            date: new Date("2023-10-26"),
            duration: 30,
            goalId: 1,
            userId: parseInt(userId),
          },
          {
            id: 2,
            type: "Cycling",
            date: new Date("2023-10-25"),
            duration: 45,
            goalId: 2,
            userId: parseInt(userId),
          },
        ])
      );
    }
    return res(ctx.status(400));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ActivityLog", () => {
  beforeEach(() => {
    useStore.setState({ user: { id: 1, email: "test@example.com" } });
  });

  it("should render the activity log with correct data", async () => {
    render(<ActivityLog activities={[]} />);
    await screen.findByText("Loading activities...");
    await screen.findByText("Running");
    await screen.findByText("Cycling");
  });

  it("should display a loading message while fetching activities", () => {
    render(<ActivityLog activities={[]} />);
    expect(screen.getByText("Loading activities...")).toBeInTheDocument();
  });

  it("should display an error message if fetching activities fails", async () => {
    server.use(
      rest.get("/progress", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<ActivityLog activities={[]} />);
    await screen.findByText("Failed to fetch activities");
  });

  it("should format dates correctly in the activity log", async () => {
    render(<ActivityLog activities={[]} />);
    await screen.findByText("2023-10-26");
    await screen.findByText("2023-10-25");
  });

  it("should sort activities by date in descending order", async () => {
    render(<ActivityLog activities={[]} />);
    const activityItems = screen.getAllByRole("listitem");
    expect(activityItems[0].textContent).toContain("2023-10-26");
    expect(activityItems[1].textContent).toContain("2023-10-25");
  });
});
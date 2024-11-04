"use client";

import React, { useState, useEffect } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProgressChart } from "@/components/features/progress/ProgressChart";
import { Activity, Goal } from "@/types";
import { apiClient } from "@/lib/api/client";
import { processData } from "@/lib/utils/formatters"; 
import { rest } from "msw";
import { setupServer } from "msw/node";
import { useStore } from "@/store"; // Import the Zustand store

// Mock the necessary dependencies
jest.mock("@/store"); 
jest.mock("@/lib/api/client"); 

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

describe("ProgressChart", () => {
  beforeEach(() => {
    // Mock Zustand state (simulating a logged-in user)
    useStore.setState({ 
      user: { 
        id: 1, 
        email: "test@example.com"
      },
      activities: [],
      goals: [
        { id: 1, title: "Lose 10 lbs", target: "150 lbs", userId: 1 },
        { id: 2, title: "Run 5km daily", target: "30 minutes", userId: 1 },
      ],
    });
  });

  it("should render the chart correctly with processed data", async () => {
    render(<ProgressChart activities={[]} goals={[]} />);
    await screen.findByText("Loading activities..."); // Wait for loading message 
    await screen.findByRole("img", { name: /chart/i }); // Wait for the chart to render
    
    // Check if the chart elements are present
    expect(screen.getByRole("img", { name: /chart/i })).toBeInTheDocument(); 

    // (Add more assertions here based on the specific chart visualization)
  });

  it("should handle API errors gracefully", async () => {
    // Mock the API client to simulate an error
    apiClient.get.mockRejectedValueOnce(new Error("Network error"));
    render(<ProgressChart activities={[]} goals={[]} />);
    await screen.findByText("Failed to fetch activities"); // Wait for the error message

    // Check for error handling
    expect(screen.getByText("Failed to fetch activities")).toBeInTheDocument();
  });

  it("should fetch data only when the user is authenticated", async () => {
    // Mock the API client to simulate a successful call
    apiClient.get.mockResolvedValueOnce({
      ok: true,
      data: [
        // Sample activity log data
      ],
    });
    // Mock Zustand state to simulate an unauthenticated user
    useStore.setState({ 
      user: null,
      activities: [],
      goals: [],
    });
    render(<ProgressChart activities={[]} goals={[]} />);
    // Ensure the component doesn't fetch data or display an error
    expect(screen.queryByText("Loading activities...")).not.toBeInTheDocument();
    expect(screen.queryByText("Failed to fetch activities")).not.toBeInTheDocument();
  });
});
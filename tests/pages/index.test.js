"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../pages/index";
import { getSession } from "next-auth/react";
import { useStore } from "@/store";
import { apiClient } from "@/lib/api/client";
import { BrowserRouter } from "react-router-dom";
import { jest } from "@jest/globals";

// Mock necessary dependencies for testing
jest.mock("next-auth/react");
jest.mock("@/store");
jest.mock("@/lib/api/client");

describe("Home", () => {
  it("should render the landing page correctly when the user is logged in", async () => {
    // Mock the session context
    const mockSession = {
      data: { user: { id: 1, name: "Test User" } },
      status: "authenticated",
    };
    getSession.mockResolvedValue(mockSession);

    // Mock the Zustand store
    const mockStore = {
      user: { id: 1, name: "Test User" },
      setUser: jest.fn(),
    };
    useStore.mockReturnValue(mockStore);

    // Render the Home page
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verify that the welcome message is rendered with the user's name
    expect(screen.getByText(`Welcome to Fitness Tracker, Test User!`)).toBeInTheDocument();
    expect(screen.getByText(`Start your fitness journey today.`)).toBeInTheDocument();

    // Verify that the button to navigate to the dashboard is rendered
    expect(screen.getByRole("button", { name: "Go to Dashboard" })).toBeInTheDocument();
  });

  it("should render the landing page correctly when the user is logged out", async () => {
    // Mock the session context
    const mockSession = {
      data: null,
      status: "unauthenticated",
    };
    getSession.mockResolvedValue(mockSession);

    // Mock the Zustand store
    const mockStore = {
      user: null,
      setUser: jest.fn(),
    };
    useStore.mockReturnValue(mockStore);

    // Render the Home page
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verify that the welcome message is not rendered
    expect(screen.queryByText(`Welcome to Fitness Tracker, Test User!`)).not.toBeInTheDocument();

    // Verify that the message about not being logged in is rendered
    expect(screen.getByText("You are not logged in. Please log in to access the application.")).toBeInTheDocument();

    // Verify that the button to navigate to the login page is rendered
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
  });

  it("should render a loading message while fetching the session", async () => {
    // Mock the session context to simulate a loading state
    const mockSession = {
      data: null,
      status: "loading",
    };
    getSession.mockResolvedValue(mockSession);

    // Render the Home page
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verify that the loading message is displayed
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should navigate to /dashboard when the \"Go to Dashboard\" button is clicked", async () => {
    // Mock the session context for a logged-in user
    const mockSession = {
      data: { user: { id: 1, name: "Test User" } },
      status: "authenticated",
    };
    getSession.mockResolvedValue(mockSession);

    // Mock the Zustand store
    const mockStore = {
      user: { id: 1, name: "Test User" },
      setUser: jest.fn(),
    };
    useStore.mockReturnValue(mockStore);

    // Mock useRouter to capture the navigation event
    const mockRouter = { push: jest.fn() };
    const { router } = useRouter();
    router.push = mockRouter.push;

    // Render the Home page
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Click the "Go to Dashboard" button
    fireEvent.click(screen.getByRole("button", { name: "Go to Dashboard" }));

    // Verify that the useRouter.push method was called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });
});
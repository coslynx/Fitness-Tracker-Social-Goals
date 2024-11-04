"use client";

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { apiClient } from "@/lib/api/client";
import { User } from "@/types";
import { useStore } from "@/store";
import { getSession } from "next-auth/react";

// Mock the API client's `post` method for handling signup requests
jest.mock("@/lib/api/client");

const server = setupServer(
  rest.get("/api/auth/session", (req, res, ctx) => {
    return res(ctx.json({}));
  }),
  rest.get("/profile", (req, res, ctx) => {
    return res(ctx.json({}));
  }),
  // ... other mocked API routes for testing authentication
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Authentication Tests", () => {
  beforeEach(async () => {
    // Mock the session context
    const mockSession = {
      data: null,
      status: "loading",
    };
    getSession.mockResolvedValueOnce(mockSession);

    // Mock the Zustand store
    const mockStore = {
      user: null,
      setUser: jest.fn(),
    };
    useStore.mockReturnValueOnce(mockStore);

    // Mock the API client
    apiClient.post.mockResolvedValue({
      ok: true,
      data: { message: "Login successful" },
    });
  });

  it("should successfully authenticate a user", async () => {
    render(<div />);

    const mockUser: User = {
      id: 1,
      email: "test@example.com",
      name: "Test User",
    };

    // Mock a successful login response
    apiClient.post.mockResolvedValueOnce({
      ok: true,
      data: mockUser,
    });

    // Simulate login form submission (you would use your actual login form component here)
    const submitButton = screen.getByRole("button", { type: "submit" });
    fireEvent.click(submitButton);

    // Verify that the user is logged in
    await waitFor(() => {
      expect(useStore().setUser).toHaveBeenCalledWith(mockUser);
    });
  });

  it("should handle incorrect credentials", async () => {
    render(<div />);

    // Mock a failed login response
    apiClient.post.mockResolvedValueOnce({
      ok: false,
      data: { message: "Invalid credentials" },
    });

    // Simulate login form submission (you would use your actual login form component here)
    const submitButton = screen.getByRole("button", { type: "submit" });
    fireEvent.click(submitButton);

    // Verify that an error message is displayed
    const errorMessage = await screen.findByText("Invalid credentials");
    expect(errorMessage).toBeInTheDocument();

    // Verify that the user is not logged in
    expect(useStore().setUser).not.toHaveBeenCalled();
  });

  it("should successfully logout a user", async () => {
    render(<div />);

    // Mock the session to simulate a logged-in user
    const mockSession: Session = {
      user: {
        id: 1,
        email: "test@example.com",
        name: "Test User",
      },
    };
    getSession.mockResolvedValueOnce({
      data: mockSession,
      status: "authenticated",
    });

    // Mock the API client's `post` method to simulate a successful logout
    apiClient.post.mockResolvedValueOnce({
      ok: true,
      data: {},
    });

    // Simulate logout (you would use your actual logout button or logic here)
    const logoutButton = screen.getByRole("button", { name: "Logout" });
    fireEvent.click(logoutButton);

    // Verify that the logout request is made
    expect(apiClient.post).toHaveBeenCalledWith("/api/auth/logout", {});

    // Verify that the user state is updated
    await waitFor(() => {
      expect(useStore().setUser).toHaveBeenCalledWith(null);
    });
  });

  it("should handle errors during authentication", async () => {
    render(<div />);

    // Mock an error during the login process
    apiClient.post.mockRejectedValueOnce(new Error("Network error"));

    // Simulate login form submission (you would use your actual login form component here)
    const submitButton = screen.getByRole("button", { type: "submit" });
    fireEvent.click(submitButton);

    // Verify that an error message is displayed (you might have an error component)
    const errorMessage = await screen.findByText("Network error");
    expect(errorMessage).toBeInTheDocument();
  });

  afterEach(async () => {
    // Reset any mock data or cleanup the test environment (e.g., remove test users)
  });
});
"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "../../features/auth/LoginForm"; // Importing the LoginForm component
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store"; // Assuming you have a store for global state
import { apiClient } from "@/lib/api/client";

jest.mock("next-auth/react");
jest.mock("next/navigation");
jest.mock("@/store"); // Assuming you have a store for global state
jest.mock("@/lib/api/client");

describe("LoginForm", () => {
  beforeEach(() => {
    // Mock useRouter and useSession
    const mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    const mockSession = {
      data: null,
      status: "loading",
    };
    useSession.mockReturnValue(mockSession);

    // Mock useStore
    const mockStore = {
      user: null,
      setUser: jest.fn(),
    };
    useStore.mockReturnValue(mockStore);

    // Mock the API client
    apiClient.post.mockResolvedValue({
      ok: true,
      data: { message: "Login successful" },
    });
  });

  it("should render the login form with input fields and submit button", () => {
    render(<LoginForm />);

    const emailInput = screen.getByRole("textbox", { name: "email" });
    const passwordInput = screen.getByRole("textbox", { name: "password" });
    const submitButton = screen.getByRole("button", { type: "submit" });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("should display an error message if the email or password field is empty", async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole("button", { type: "submit" });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(
      "Please enter both email and password"
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("should call the API with the correct credentials on form submission", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByRole("textbox", { name: "email" });
    const passwordInput = screen.getByRole("textbox", { name: "password" });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { type: "submit" });
    fireEvent.click(submitButton);

    expect(apiClient.post).toHaveBeenCalledWith("/api/auth/session", {
      email: "test@example.com",
      password: "password123",
    });
  });

  it("should redirect the user to the dashboard on successful login", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByRole("textbox", { name: "email" });
    const passwordInput = screen.getByRole("textbox", { name: "password" });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { type: "submit" });
    fireEvent.click(submitButton);

    expect(useRouter().push).toHaveBeenCalledWith("/dashboard");
  });

  it("should display an error message if the login fails", async () => {
    apiClient.post.mockResolvedValue({
      ok: false,
      data: { message: "Invalid credentials" },
    });

    render(<LoginForm />);

    const emailInput = screen.getByRole("textbox", { name: "email" });
    const passwordInput = screen.getByRole("textbox", { name: "password" });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const submitButton = screen.getByRole("button", { type: "submit" });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText("Invalid credentials");
    expect(errorMessage).toBeInTheDocument();
  });
});
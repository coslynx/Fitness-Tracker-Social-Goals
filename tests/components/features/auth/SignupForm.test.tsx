"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import SignupForm from "../../../../components/features/auth/SignupForm"; // Import the SignupForm component
import { apiClient } from "../../../../lib/api/client"; // Import the API client 
import { useSession } from "next-auth/react"; // Import the NextAuth.js session context
import { useStore } from "@/store"; // Import the Zustand store

// Mock necessary dependencies for testing
jest.mock("next-auth/react");
jest.mock("@/store"); 
jest.mock("../../../../lib/api/client");

describe("SignupForm", () => {
  beforeEach(() => {
    // Mock the NextAuth.js session context (e.g., to simulate a logged-in user)
    const mockSession = {
      data: { user: { id: 1, name: "Test User" } },
      status: "authenticated", 
    };
    useSession.mockReturnValue(mockSession);

    // Mock the Zustand store (e.g., to simulate a user)
    const mockStore = {
      user: { id: 1, email: "test@example.com" }, // Add necessary fields
      setUser: jest.fn(), 
    };
    useStore.mockReturnValue(mockStore);

    // Mock the API client's `post` method for handling signup requests
    apiClient.post.mockResolvedValue({
      ok: true, // Simulate a successful response
      data: { message: "Signup successful" }, 
    });
  });

  it("should render the signup form with input fields and submit button", () => {
    render(<SignupForm />);

    // Check if the form elements are rendered in the DOM
    const emailInput = screen.getByRole("textbox", { name: "email" });
    const passwordInput = screen.getByRole("textbox", { name: "password" });
    const submitButton = screen.getByRole("button", { type: "submit" });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("should display an error message if the email or password field is empty", async () => {
    render(<SignupForm />);

    // Simulate a form submission with empty fields
    const submitButton = screen.getByRole("button", { type: "submit" });
    fireEvent.click(submitButton); 

    // Verify that an error message is displayed
    const errorMessage = await screen.findByText(
      "Please enter both email and password"
    ); 
    expect(errorMessage).toBeInTheDocument();
  });

  it("should call the API with the correct credentials on form submission", async () => {
    render(<SignupForm />);

    // Enter test values into the form fields
    const emailInput = screen.getByRole("textbox", { name: "email" });
    const passwordInput = screen.getByRole("textbox", { name: "password" });
    fireEvent.change(emailInput, { target: { value: "test2@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Simulate form submission
    const submitButton = screen.getByRole("button", { type: "submit" });
    fireEvent.click(submitButton);

    // Verify that the API was called with the correct data
    expect(apiClient.post).toHaveBeenCalledWith("/api/auth/signup", {
      email: "test2@example.com",
      password: "password123", 
    });
  });

  it("should handle successful signup and update user state", async () => {
    render(<SignupForm />);

    // Enter test values into the form fields
    const emailInput = screen.getByRole("textbox", { name: "email" });
    const passwordInput = screen.getByRole("textbox", { name: "password" });
    fireEvent.change(emailInput, { target: { value: "test3@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Simulate form submission
    const submitButton = screen.getByRole("button", { type: "submit" });
    fireEvent.click(submitButton);

    // Verify that the API was called with the correct data
    expect(apiClient.post).toHaveBeenCalledWith("/api/auth/signup", {
      email: "test3@example.com",
      password: "password123",
    });

    // Verify that the user state was updated
    expect(useStore().setUser).toHaveBeenCalledWith({
      id: 1, 
      email: "test3@example.com", // Update the email to the new user's email
    });

    // Verify that a success message is displayed (optional)
    const successMessage = await screen.findByText("Signup successful");
    expect(successMessage).toBeInTheDocument();
  });

  it("should display an error message if signup fails", async () => {
    // Mock the API client's `post` method to simulate a failed signup
    apiClient.post.mockResolvedValue({
      ok: false, // Simulate a failed response
      data: { message: "Failed to signup" }, // Error message from API
    });

    render(<SignupForm />);

    // Enter test values into the form fields
    const emailInput = screen.getByRole("textbox", { name: "email" });
    const passwordInput = screen.getByRole("textbox", { name: "password" });
    fireEvent.change(emailInput, { target: { value: "test4@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Simulate form submission
    const submitButton = screen.getByRole("button", { type: "submit" });
    fireEvent.click(submitButton);

    // Verify that the API was called with the correct data
    expect(apiClient.post).toHaveBeenCalledWith("/api/auth/signup", {
      email: "test4@example.com",
      password: "password123",
    });

    // Verify that the user state was not updated (signup failed)
    expect(useStore().setUser).not.toHaveBeenCalled();

    // Verify that an error message is displayed
    const errorMessage = await screen.findByText("Failed to signup");
    expect(errorMessage).toBeInTheDocument();
  });
});
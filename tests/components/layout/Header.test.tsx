"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import Header from "@/components/layout/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";

jest.mock("next-auth/react");
jest.mock("next/navigation");
jest.mock("@/store");

describe("Header", () => {
  beforeEach(() => {
    // Mock useRouter
    const mockRouter = {
      push: jest.fn(),
    };
    useRouter.mockReturnValue(mockRouter);

    // Mock useSession
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
  });

  it("should render the header with the logo and navigation links", () => {
    render(<Header />);

    expect(screen.getByRole("img", { name: "Fitness Tracker Logo" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
  });

  describe("when user is logged in", () => {
    beforeEach(() => {
      // Mock the session context for a logged-in user.
      useSession.mockReturnValue({
        data: { user: { id: 1, name: "Test User" } },
        status: "authenticated",
      });
    });

    it("should display the logout button", () => {
      render(<Header />);
      expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
    });

    it("should call setUser with null and navigate to / on logout", async () => {
      const mockRouter = { push: jest.fn() };
      useRouter.mockReturnValue(mockRouter);

      render(<Header />);
      const logoutButton = screen.getByRole("button", { name: "Logout" });
      fireEvent.click(logoutButton);

      expect(useStore().setUser).toHaveBeenCalledWith(null);
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  describe("when user is logged out", () => {
    beforeEach(() => {
      useSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });
    });

    it("should display the login link", () => {
      render(<Header />);
      expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    });
  });

  it("clicking on the Dashboard link should navigate to /dashboard", () => {
    useSession.mockReturnValue({
      data: { user: { id: 1, name: "Test User" } },
      status: "authenticated",
    });

    const mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    render(<Header />);
    fireEvent.click(screen.getByRole("link", { name: "Dashboard" }));
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("clicking on the Goals link should navigate to /goals", () => {
    useSession.mockReturnValue({
      data: { user: { id: 1, name: "Test User" } },
      status: "authenticated",
    });

    const mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    render(<Header />);
    fireEvent.click(screen.getByRole("link", { name: "Goals" }));
    expect(mockRouter.push).toHaveBeenCalledWith("/goals");
  });

  it("clicking on the Profile link should navigate to /profile", () => {
    useSession.mockReturnValue({
      data: { user: { id: 1, name: "Test User" } },
      status: "authenticated",
    });

    const mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    render(<Header />);
    fireEvent.click(screen.getByRole("link", { name: "Profile" }));
    expect(mockRouter.push).toHaveBeenCalledWith("/profile");
  });
});
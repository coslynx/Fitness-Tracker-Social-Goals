"use client";

import { renderHook, act } from "@testing-library/react-hooks";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import useFetch from "../../lib/utils/hooks/useFetch";
import { apiClient } from "@/lib/api/client";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("useFetch", () => {
  it("should successfully fetch data from the API", async () => {
    server.use(
      rest.get("/goals", (req, res, ctx) => {
        return res(
          ctx.json([
            { id: 1, title: "Lose 10 lbs", target: "150 lbs" },
            { id: 2, title: "Run 5km daily", target: "30 minutes" },
          ])
        );
      })
    );

    const { result } = renderHook(() => useFetch("/goals"));

    await waitFor(() => {
      expect(result.current.data).toEqual([
        { id: 1, title: "Lose 10 lbs", target: "150 lbs" },
        { id: 2, title: "Run 5km daily", target: "30 minutes" },
      ]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  it("should handle API errors", async () => {
    server.use(
      rest.get("/goals", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Internal Server Error" }));
      })
    );

    const { result } = renderHook(() => useFetch("/goals"));

    await waitFor(() => {
      expect(result.current.data).toBe(null);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toEqual({ message: "Internal Server Error" });
    });
  });

  it("should handle API errors gracefully", async () => {
    server.use(
      rest.get("/goals", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const { result } = renderHook(() => useFetch("/goals"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).not.toBe(null); // Check if error is not null
    });
  });
});
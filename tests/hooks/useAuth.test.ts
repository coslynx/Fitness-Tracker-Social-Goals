import { renderHook, act } from '@testing-library/react-hooks';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import { Session, Provider } from 'next-auth/react';
import useAuth from '../../lib/utils/hooks/useAuth'; // Import our custom hook
import { useStore } from '@/store'; // Import the Zustand store
import { apiClient } from '@/lib/api/client'; // Import the API client
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock the API client's `post` method for handling signup requests
jest.mock('@/lib/api/client');

const server = setupServer(
  rest.get('/api/auth/session', (req, res, ctx) => {
    return res(ctx.json({}));
  }),
  rest.get('/profile', (req, res, ctx) => {
    return res(ctx.json({}));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useAuth', () => {
  // 1. Test the initial state
  it('should return an empty user object and loading status true initially', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toEqual(null);
    expect(result.current.loading).toBe(true);
  });

  // 2. Test successful authentication
  it('should return the correct user object and loading status false after successful authentication', async () => {
    const mockSession: Session = {
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      },
    };
    const mockProvider: Provider = {
      // ... Provider data (not required for this test)
    };

    const { result } = renderHook(() => useAuth());

    // Use the mock Session data
    useSession.mockReturnValueOnce({
      data: mockSession,
      status: 'authenticated',
    });

    // Use the mock Provider data
    Provider.mockReturnValueOnce(mockProvider);

    await waitFor(() => {
      expect(result.current.user).toEqual(mockSession.user);
      expect(result.current.loading).toBe(false);
    });
  });

  // 3. Test the loading state when session status is "loading"
  it('should return loading status true when session status is "loading"', async () => {
    const { result } = renderHook(() => useAuth());

    // Mock the session context for a loading state
    useSession.mockReturnValueOnce({
      data: null, // Not yet available
      status: 'loading',
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });
  });

  // 4. Test the case when session status is "unauthenticated"
  it('should return loading status false and user null when session status is "unauthenticated"', async () => {
    const { result } = renderHook(() => useAuth());

    // Mock the session context for an unauthenticated state
    useSession.mockReturnValueOnce({
      data: null, // Not yet available
      status: 'unauthenticated',
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(null);
      expect(result.current.loading).toBe(false);
    });
  });

  // 5. Test the setUser function updates the user state
  it('should update the user state when setUser is called', () => {
    const { result } = renderHook(() => useAuth());
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    act(() => result.current.setUser(mockUser));
    expect(result.current.user).toEqual(mockUser);
  });

  // 6. Test handling of errors during session retrieval
  it('should handle errors gracefully during session retrieval', async () => {
    const { result } = renderHook(() => useAuth());

    // Mock useSession to throw an error
    useSession.mockRejectedValueOnce(new Error('Session retrieval failed'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).toEqual(null);
    });
  });
});
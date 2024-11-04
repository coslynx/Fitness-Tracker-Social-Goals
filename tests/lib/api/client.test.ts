"use client";

import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { apiClient } from '@/lib/api/client'; // Import the API client
import { Goal } from '@/types'; // Import goal type
import { Activity } from '@/types'; // Import activity type
import { useGoalsStore } from '@/store'; // Import Zustand store 
import { Button } from '@/components/common/Button'; // Import button component
import { Input } from '@/components/common/Input'; // Import input component 
import { Modal } from '@/components/common/Modal'; // Import modal component

const server = setupServer(
  rest.get('/goals', (req, res, ctx) => {
    const userId = req.url.searchParams.get('userId');
    if (userId) {
      return res(
        ctx.json([
          {
            id: 1,
            title: 'Lose 10 lbs',
            target: '150 lbs',
            userId: parseInt(userId),
            createdAt: new Date(),
          },
          {
            id: 2,
            title: 'Run 5km daily',
            target: '30 minutes',
            userId: parseInt(userId),
            createdAt: new Date(),
          },
        ])
      );
    }
    return res(ctx.status(400));
  }),
  rest.post('/goals', (req, res, ctx) => {
    const newGoal: Goal = req.body;
    return res(ctx.json(newGoal));
  }),
  rest.put('/goals/:id', (req, res, ctx) => {
    const goalId = parseInt(req.params.id);
    const updatedGoal = req.body as Goal;
    return res(ctx.json(updatedGoal));
  }),
  rest.delete('/goals/:id', (req, res, ctx) => {
    const goalId = parseInt(req.params.id);
    return res(ctx.status(204));
  }),
  rest.get('/progress', (req, res, ctx) => {
    const userId = req.url.searchParams.get('userId');
    if (userId) {
      return res(
        ctx.json([
          {
            id: 1,
            type: 'Running',
            date: new Date('2023-10-26'),
            duration: 30,
            goalId: 1,
            userId: parseInt(userId),
          },
          {
            id: 2,
            type: 'Cycling',
            date: new Date('2023-10-25'),
            duration: 45,
            goalId: 2,
            userId: parseInt(userId),
          },
        ])
      );
    }
    return res(ctx.status(400));
  }),
  rest.post('/progress', (req, res, ctx) => {
    const newActivity: Activity = req.body;
    return res(ctx.json(newActivity));
  }),
  rest.put('/progress/:id', (req, res, ctx) => {
    const activityId = parseInt(req.params.id);
    const updatedActivity = req.body as Activity;
    return res(ctx.json(updatedActivity));
  }),
  rest.delete('/progress/:id', (req, res, ctx) => {
    const activityId = parseInt(req.params.id);
    return res(ctx.status(204));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('apiClient', () => {
  const userId = 1;

  it('should fetch goals for a given user ID', async () => {
    render(<div />); // Render a dummy component to avoid warnings
    const goals = await apiClient.getGoals(userId);
    expect(goals).toBeDefined();
    expect(goals.length).toBeGreaterThanOrEqual(2);
  });

  it('should create a new goal', async () => {
    const newGoal: Goal = {
      title: 'New Goal',
      target: 'New Target',
      userId,
      createdAt: new Date(),
    };

    render(<div />); // Render a dummy component to avoid warnings
    const createdGoal = await apiClient.createGoal(newGoal);
    expect(createdGoal).toBeDefined();
    expect(createdGoal.title).toBe('New Goal');
    expect(createdGoal.target).toBe('New Target');
  });

  it('should update an existing goal', async () => {
    const updatedGoal: Goal = {
      id: 1,
      title: 'Updated Goal Title',
      target: 'Updated Goal Target',
      userId,
      createdAt: new Date(),
    };

    render(<div />); // Render a dummy component to avoid warnings
    const updated = await apiClient.updateGoal(updatedGoal);
    expect(updated).toBeDefined();
    expect(updated.title).toBe('Updated Goal Title');
    expect(updated.target).toBe('Updated Goal Target');
  });

  it('should delete a goal', async () => {
    const goalId = 1;

    render(<div />); // Render a dummy component to avoid warnings
    await apiClient.deleteGoal(goalId);
  });

  it('should fetch activities for a given user ID', async () => {
    render(<div />); // Render a dummy component to avoid warnings
    const activities = await apiClient.getActivities(userId);
    expect(activities).toBeDefined();
    expect(activities.length).toBeGreaterThanOrEqual(2);
  });

  it('should create a new activity', async () => {
    const newActivity: Activity = {
      type: 'Walking',
      date: new Date('2023-10-27'),
      duration: 40,
      goalId: 1,
      userId,
    };

    render(<div />); // Render a dummy component to avoid warnings
    const createdActivity = await apiClient.createActivity(newActivity);
    expect(createdActivity).toBeDefined();
    expect(createdActivity.type).toBe('Walking');
    expect(createdActivity.duration).toBe(40);
  });

  it('should update an existing activity', async () => {
    const updatedActivity: Activity = {
      id: 1,
      type: 'Running',
      date: new Date('2023-10-26'),
      duration: 50,
      goalId: 1,
      userId,
    };

    render(<div />); // Render a dummy component to avoid warnings
    const updated = await apiClient.updateActivity(updatedActivity);
    expect(updated).toBeDefined();
    expect(updated.duration).toBe(50);
  });

  it('should delete an activity', async () => {
    const activityId = 1;

    render(<div />); // Render a dummy component to avoid warnings
    await apiClient.deleteActivity(activityId);
  });

  it('should handle errors during API calls gracefully', async () => {
    server.use(
      rest.get('/goals', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<div />); // Render a dummy component to avoid warnings
    try {
      await apiClient.getGoals(userId);
    } catch (error) {
      console.error('Error fetching goals:', error);
      expect(error).toBeDefined();
    }
  });
});
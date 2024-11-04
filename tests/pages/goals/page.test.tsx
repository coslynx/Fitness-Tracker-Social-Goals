"use client";

import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import GoalsPage from '@/pages/goals/page';
import { apiClient } from '@/lib/api/client';
import { Goal } from '@/types';
import { useGoalsStore } from '@/store';

// Set up the MSW server
const server = setupServer(
  rest.get('/goals', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          title: 'Lose 10 lbs',
          target: '150 lbs',
          userId: 1,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: 'Run 5km daily',
          target: '30 minutes',
          userId: 1,
          createdAt: new Date(),
        },
      ])
    );
  }),
  rest.put('/goals/:id', (req, res, ctx) => {
    const goalId = parseInt(req.params.id);
    const updatedGoal = req.body as Goal;
    return res(ctx.json(updatedGoal));
  }),
  rest.delete('/goals/:id', (req, res, ctx) => {
    const goalId = parseInt(req.params.id);
    return res(ctx.status(204));
  })
);

// Start the MSW server before the tests
beforeAll(() => server.listen());

// Reset handlers before each test
afterEach(() => server.resetHandlers());

// Close the server after all tests are finished
afterAll(() => server.close());

describe('GoalsPage', () => {
  beforeEach(() => {
    // Mock the Zustand store to simulate a logged-in user with some goals
    useGoalsStore.setState({
      user: { id: 1, email: 'test@example.com' },
      goals: [], // Initialize goals array
    });
  });

  it('should render the Goals page with a list of goals', async () => {
    render(<GoalsPage />); 
    await screen.findByText('Your Fitness Goals'); // Wait for the page title to render

    // Assert that the goals are displayed
    const goalTitles = await screen.findAllByRole('heading', {
      level: 3, // Search for h3 elements for goal titles
    });
    expect(goalTitles).toHaveLength(2); // Expect two goal titles to be rendered
    expect(goalTitles[0]).toHaveTextContent('Lose 10 lbs');
    expect(goalTitles[1]).toHaveTextContent('Run 5km daily');
  });

  it('should handle successful goal creation', async () => {
    render(<GoalsPage />);

    // Fill out the goal form
    const titleInput = screen.getByRole('textbox', { name: 'title' });
    const targetInput = screen.getByRole('textbox', { name: 'target' });
    fireEvent.change(titleInput, { target: { value: 'Gain 10 lbs' } });
    fireEvent.change(targetInput, { target: { value: '160 lbs' } });

    // Submit the form
    const createButton = screen.getByRole('button', { type: 'submit' });
    fireEvent.click(createButton);

    // Verify that the API call was made with the correct data
    expect(apiClient.post).toHaveBeenCalledWith('/goals', {
      title: 'Gain 10 lbs',
      target: '160 lbs',
      userId: 1, // Simulating the user ID
    });

    // Verify that the new goal is added to the store and rendered on the page
    expect(useGoalsStore.getState().goals).toContainEqual({
      title: 'Gain 10 lbs',
      target: '160 lbs',
      userId: 1,
      id: expect.any(Number),
      createdAt: expect.any(Date),
    });

    const newGoalTitle = await screen.findByText('Gain 10 lbs');
    expect(newGoalTitle).toBeInTheDocument();
  });

  it('should display an error message if goal creation fails', async () => {
    // Mock a failed API call
    server.use(
      rest.post('/goals', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    render(<GoalsPage />);

    // Fill out the form and submit
    const titleInput = screen.getByRole('textbox', { name: 'title' });
    const targetInput = screen.getByRole('textbox', { name: 'target' });
    fireEvent.change(titleInput, { target: { value: 'Gain 5 lbs' } });
    fireEvent.change(targetInput, { target: { value: '155 lbs' } });
    const createButton = screen.getByRole('button', { type: 'submit' });
    fireEvent.click(createButton);

    // Verify that the error message is displayed
    const errorMessage = await screen.findByText('Failed to create goal');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should update an existing goal', async () => {
    render(<GoalsPage />);

    // Open the edit modal (simulating a click event)
    const editButton = await screen.findByRole('button', { name: 'Edit' });
    fireEvent.click(editButton);

    // Update the input fields in the modal
    const titleInput = screen.getByRole('textbox', { name: 'edit-title' });
    const targetInput = screen.getByRole('textbox', { name: 'edit-target' });
    fireEvent.change(titleInput, { target: { value: 'Updated Goal Title' } });
    fireEvent.change(targetInput, { target: { value: 'Updated Goal Target' } });

    // Click the Save button
    const saveButton = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(saveButton);

    // Verify the API call was made with the correct data
    expect(apiClient.put).toHaveBeenCalledWith('/goals/1', {
      id: 1,
      title: 'Updated Goal Title',
      target: 'Updated Goal Target',
      userId: 1,
      createdAt: expect.any(Date),
    });

    // Verify that the goal is updated in the UI
    const updatedGoalTitle = await screen.findByText('Updated Goal Title');
    expect(updatedGoalTitle).toBeInTheDocument();
    const updatedGoalTarget = await screen.findByText('Updated Goal Target');
    expect(updatedGoalTarget).toBeInTheDocument();
  });

  it('should delete an existing goal', async () => {
    render(<GoalsPage />);

    // Simulate clicking the Delete button
    const deleteButton = await screen.findByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButton);

    // Verify that the API call was made to delete the goal
    expect(apiClient.delete).toHaveBeenCalledWith('/goals/1'); 

    // Verify that the goal is no longer displayed on the page
    expect(screen.queryByText('Lose 10 lbs')).not.toBeInTheDocument();
  });
});
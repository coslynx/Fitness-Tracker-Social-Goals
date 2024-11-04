"use client";

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { GoalForm } from '@/components/features/goals/GoalForm';
import { Goal } from '@/types';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useGoalsStore } from '@/store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/goals', (req, res, ctx) => {
    const newGoal: Goal = req.body;
    return res(ctx.json(newGoal));
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GoalForm', () => {
  beforeEach(() => {
    useGoalsStore.setState({ user: { id: 1, email: 'test@example.com' } });
  });

  it('should render the form with input fields and submit button', () => {
    render(<GoalForm />);

    const titleInput = screen.getByRole('textbox', { name: 'title' });
    const targetInput = screen.getByRole('textbox', { name: 'target' });
    const submitButton = screen.getByRole('button', { type: 'submit' });

    expect(titleInput).toBeInTheDocument();
    expect(targetInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it('should display an error message if the title or target field is empty', async () => {
    render(<GoalForm />);

    const submitButton = screen.getByRole('button', { type: 'submit' });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText('Please enter both title and target');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should call the API with the correct credentials on form submission', async () => {
    render(<GoalForm />);

    const titleInput = screen.getByRole('textbox', { name: 'title' });
    const targetInput = screen.getByRole('textbox', { name: 'target' });
    fireEvent.change(titleInput, { target: { value: 'Lose 10 lbs' } });
    fireEvent.change(targetInput, { target: { value: '150 lbs' } });

    const submitButton = screen.getByRole('button', { type: 'submit' });
    fireEvent.click(submitButton);

    expect(apiClient.post).toHaveBeenCalledWith('/goals', {
      title: 'Lose 10 lbs',
      target: '150 lbs',
      userId: 1,
    });
  });

  it('should handle successful goal creation and update store', async () => {
    render(<GoalForm />);

    const titleInput = screen.getByRole('textbox', { name: 'title' });
    const targetInput = screen.getByRole('textbox', { name: 'target' });
    fireEvent.change(titleInput, { target: { value: 'Run 5km daily' } });
    fireEvent.change(targetInput, { target: { value: '30 minutes' } });

    const submitButton = screen.getByRole('button', { type: 'submit' });
    fireEvent.click(submitButton);

    expect(useGoalsStore.getState().goals).toContainEqual({
      title: 'Run 5km daily',
      target: '30 minutes',
      userId: 1,
      id: expect.any(Number),
      createdAt: expect.any(Date),
    });
  });

  it('should display an error message if goal creation fails', async () => {
    server.use(
      rest.post('/goals', (req, res, ctx) => {
        return res(ctx.status(500));
      }),
    );

    render(<GoalForm />);

    const titleInput = screen.getByRole('textbox', { name: 'title' });
    const targetInput = screen.getByRole('textbox', { name: 'target' });
    fireEvent.change(titleInput, { target: { value: 'Gain 10 lbs' } });
    fireEvent.change(targetInput, { target: { value: '160 lbs' } });

    const submitButton = screen.getByRole('button', { type: 'submit' });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText('Failed to create goal');
    expect(errorMessage).toBeInTheDocument();
  });
});
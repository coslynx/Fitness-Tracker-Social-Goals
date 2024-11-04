"use client";

import { render, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ProfilePage from '@/pages/profile/page';
import { apiClient } from '@/lib/api/client';
import { Goal } from '@/types';
import { Activity } from '@/types';
import { useStore } from '@/store';

// Set up the MSW server for mocking API requests
const server = setupServer(
    rest.get('/profile', (req, res, ctx) => {
        return res(
            ctx.json({
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
            })
        );
    }),
    rest.put('/profile', (req, res, ctx) => {
        const updatedProfile = req.body as { name: string; password: string };
        return res(ctx.json({ 
            ...updatedProfile, 
            id: 1 
        }));
    })
);

// Start the server before the tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Stop the server after all tests
afterAll(() => server.close());

describe('ProfilePage', () => {
    beforeEach(() => {
        useStore.setState({
            user: { id: 1, email: 'test@example.com', name: 'Test User' },
        });
    });

    it('should render the Profile page with the correct user information', async () => {
        render(<ProfilePage />);
        await screen.findByText('Your Profile');
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument(); 
    });

    it('should update the user profile when the form is submitted', async () => {
        render(<ProfilePage />);

        const nameInput = screen.getByRole('textbox', { name: 'name' });
        const passwordInput = screen.getByRole('textbox', { name: 'password' });

        fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
        fireEvent.change(passwordInput, { target: { value: 'newpassword123' } }); 

        const updateButton = screen.getByRole('button', { name: 'Update Profile' });
        fireEvent.click(updateButton); 

        expect(apiClient.put).toHaveBeenCalledWith('/profile', {
            name: 'Updated Name',
            password: 'newpassword123',
        });

        expect(screen.getByText('Updated Name')).toBeInTheDocument(); 
    });

    it('should display an error message if the profile update fails', async () => {
        apiClient.put.mockRejectedValueOnce(new Error('Failed to update profile'));

        render(<ProfilePage />);

        const nameInput = screen.getByRole('textbox', { name: 'name' });
        const passwordInput = screen.getByRole('textbox', { name: 'password' });
        fireEvent.change(nameInput, { target: { value: 'Updated Name' } });
        fireEvent.change(passwordInput, { target: { value: 'newpassword123' } }); 

        const updateButton = screen.getByRole('button', { name: 'Update Profile' });
        fireEvent.click(updateButton); 

        const errorMessage = await screen.findByText('Failed to update profile');
        expect(errorMessage).toBeInTheDocument();
    });
});
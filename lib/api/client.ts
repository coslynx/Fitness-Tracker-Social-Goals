import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

interface User {
  id: number;
  email: string;
  name?: string;
}

interface Goal {
  id: number;
  title: string;
  target: string;
  userId: number;
}

interface Activity {
  id: number;
  type: string;
  date: Date;
  duration: number;
  goalId: number;
  userId: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  }

  async getSession(): Promise<any> {
    try {
      const session = await getSession();
      return session;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  }

  async getGoals(userId: number): Promise<Goal[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/goals`, { params: { userId } });
      return response.data;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }

  async createGoal(goal: Goal): Promise<Goal> {
    try {
      const response = await axios.post(`${this.baseUrl}/goals`, goal);
      return response.data;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  async updateGoal(goal: Goal): Promise<Goal> {
    try {
      const response = await axios.put(`${this.baseUrl}/goals/${goal.id}`, goal);
      return response.data;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  async deleteGoal(goalId: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/goals/${goalId}`);
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }

  async getActivities(userId: number, goalId?: number, startDate?: Date, endDate?: Date): Promise<Activity[]> {
    try {
      const params: any = { userId };
      if (goalId) {
        params.goalId = goalId;
      }
      if (startDate && endDate) {
        params.date = { gte: startDate, lte: endDate };
      }
      const response = await axios.get(`${this.baseUrl}/progress`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  }

  async createActivity(activity: Activity): Promise<Activity> {
    try {
      const response = await axios.post(`${this.baseUrl}/progress`, activity);
      return response.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  async updateActivity(activity: Activity): Promise<Activity> {
    try {
      const response = await axios.put(`${this.baseUrl}/progress/${activity.id}`, activity);
      return response.data;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }

  async deleteActivity(activityId: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/progress/${activityId}`);
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;
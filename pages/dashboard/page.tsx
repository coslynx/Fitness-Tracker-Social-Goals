import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useStore } from "@/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoalList } from "@/components/features/goals/GoalList";
import { ActivityLog } from "@/components/features/progress/ActivityLog";
import { ProgressChart } from "@/components/features/progress/ProgressChart";
import { apiClient } from "@/lib/api/client";
import { getFormattedDate } from "@/lib/utils/formatters";

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

function DashboardPage() {
  const router = useRouter();
  const { user } = useStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchUserGoals(user.id);
      fetchUserActivities(user.id);
    }
  }, [user]);

  const fetchUserGoals = async (userId: number) => {
    try {
      const response = await apiClient.get(`/goals`, {
        params: { userId },
      });
      setGoals(response.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const fetchUserActivities = async (userId: number) => {
    try {
      const response = await apiClient.get(`/progress`, {
        params: { userId },
      });
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  return (
    <>
      <Header user={user} />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold mb-10">Fitness Tracker Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Goals</h2>
            <GoalList goals={goals} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <ActivityLog activities={activities} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Progress Overview</h2>
            <ProgressChart activities={activities} goals={goals} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default DashboardPage;
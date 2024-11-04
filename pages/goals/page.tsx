import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useGoalsStore } from "@/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoalList } from "@/components/features/goals/GoalList";
import { GoalForm } from "@/components/features/goals/GoalForm";
import { apiClient } from "@/lib/api/client";

interface Goal {
  id: number;
  title: string;
  target: string;
  userId: number;
}

function GoalsPage() {
  const router = useRouter();
  const { user } = useGoalsStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        if (user?.id) {
          setIsLoading(true);
          const response = await apiClient.get("/goals", {
            params: { userId: user.id },
          });
          useGoalsStore.setState({ goals: response.data });
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  return (
    <>
      <Header user={user} />
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className="text-4xl font-bold mb-10">Your Fitness Goals</h1>
        {isLoading ? (
          <p>Loading goals...</p>
        ) : (
          <>
            <GoalList />
            <GoalForm />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default GoalsPage;
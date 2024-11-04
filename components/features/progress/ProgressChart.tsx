"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/store";
import { Activity, Goal } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { apiClient } from "@/lib/api/client";
import { processData } from "@/lib/utils/formatters"; // Import our data processing function

interface ProgressChartProps {
  activities: Activity[];
  goals: Goal[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ activities, goals }) => {
  const { user } = useStore(); // Access the user from Zustand for potentially filtering data
  const [chartData, setChartData] = useState<any[]>([]); // Initialize chartData state

  useEffect(() => {
    if (user) {
      // Only fetch data if the user is authenticated
      fetchChartData(user.id);
    }
  }, [user, activities, goals]);

  const fetchChartData = async (userId: number) => {
    try {
      // Fetch relevant data from the API using our client
      const response = await apiClient.get("/progress", { params: { userId } });
      const processed = processData(response.data, goals); // Process data using our formatter
      setChartData(processed);
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error("Error fetching chart data:", error);
    }
  };

  return (
    <ChartContainer>
      <LineChart width={600} height={300} data={chartData}>
        <XAxis
          dataKey="date"
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
        />
        <YAxis />
        <CartesianGrid stroke="#f5f5f5" />
        <Tooltip />
        <Legend />
        {/* Add lines for each goal or activity type */}
        {goals.map((goal) => (
          <Line
            key={goal.id}
            type="monotone"
            dataKey={goal.title}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};

const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-white shadow-md p-4 rounded-md">{children}</div>;
};

export default ProgressChart;
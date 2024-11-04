"use client";

import React, { useState } from "react";
import { useGoalsStore } from "@/store";
import { Goal } from "@/types";
import { apiClient } from "@/lib/api/client";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import styles from "./GoalForm.module.css";

interface GoalFormProps {
  onSubmit?: (goal: Goal) => void; // Optional callback for submission
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit }) => {
  const { user, addGoal } = useGoalsStore();
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "target") {
      setTarget(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!title || !target) {
        setError("Please enter both title and target");
        setIsLoading(false);
        return;
      }

      if (!user) {
        setError("Please log in to create goals");
        setIsLoading(false);
        return;
      }

      const response = await apiClient.post("/goals", {
        title,
        target,
        userId: user.id,
      });

      if (response.ok) {
        const newGoal: Goal = response.data;
        addGoal(newGoal);
        setTitle("");
        setTarget("");
        setIsLoading(false);
        if (onSubmit) {
          onSubmit(newGoal);
        }
      } else {
        setError(response.data.message || "Failed to create goal");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      setError("Failed to create goal. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.goalForm}>
      <h2 className="text-2xl font-bold mb-4">Create New Goal</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
          Title:
        </label>
        <Input
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="target" className="block text-gray-700 font-bold mb-2">
          Target:
        </label>
        <Input
          id="target"
          type="text"
          name="target"
          value={target}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-brand-primary-dark"
      >
        {isLoading ? "Creating..." : "Create Goal"}
      </Button>
    </form>
  );
};

export default GoalForm;
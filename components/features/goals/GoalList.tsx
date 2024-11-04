"use client";

import React, { useState, useEffect } from 'react';
import { useGoalsStore } from '@/store';
import { Goal } from '@/types';
import { apiClient } from '@/lib/api/client';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import styles from './GoalList.module.css';

interface GoalListItemProps {
  goal: Goal;
  onDelete: (goalId: number) => void;
  onEdit: (goalId: number) => void;
}

const GoalListItem: React.FC<GoalListItemProps> = ({ goal, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(goal.title);
  const [editedTarget, setEditedTarget] = useState(goal.target);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = () => {
    onDelete(goal.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      const updatedGoal: Goal = {
        id: goal.id,
        title: editedTitle,
        target: editedTarget,
        userId: goal.userId,
        createdAt: goal.createdAt,
      };

      await apiClient.put(`/goals/${goal.id}`, updatedGoal);
      useGoalsStore.setState({
        goals: useGoalsStore.getState().goals.map((g) =>
          g.id === goal.id ? updatedGoal : g
        ),
      });
      setIsEditing(false);
      setIsSaving(false);
    } catch (error) {
      console.error('Error updating goal:', error);
      setError('Failed to update goal. Please try again.');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(goal.title);
    setEditedTarget(goal.target);
  };

  return (
    <li className={styles.goalListItem}>
      <div className={styles.goalInfo}>
        {isEditing ? (
          <>
            <Input
              id={`edit-title-${goal.id}`}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <Input
              id={`edit-target-${goal.id}`}
              type="text"
              value={editedTarget}
              onChange={(e) => setEditedTarget(e.target.value)}
            />
          </>
        ) : (
          <>
            <h3 className={styles.goalTitle}>{goal.title}</h3>
            <p className={styles.goalTarget}>Target: {goal.target}</p>
          </>
        )}
      </div>
      <div className={styles.goalActions}>
        {isEditing ? (
          <>
            <Button
              variant="primary"
              disabled={isSaving}
              onClick={handleSave}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={() => onEdit(goal.id)}>
              Edit
            </Button>
            <Button variant="secondary" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </li>
  );
};

const GoalList: React.FC = () => {
  const { goals, fetchGoals, deleteGoal, updateGoal } = useGoalsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedTarget, setEditedTarget] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGoals();
    setIsLoading(false);
  }, []);

  const handleDeleteGoal = (goalId: number) => {
    deleteGoal(goalId);
  };

  const handleEditGoal = (goalId: number) => {
    setSelectedGoalId(goalId);
    setIsEditing(true);
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      setEditedTitle(goal.title);
      setEditedTarget(goal.target);
    }
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    setError('');

    try {
      const updatedGoal: Goal = {
        id: selectedGoalId!,
        title: editedTitle,
        target: editedTarget,
        userId: goals.find((g) => g.id === selectedGoalId)?.userId!, // Get userId from state
        createdAt: goals.find((g) => g.id === selectedGoalId)?.createdAt!,
      };

      await apiClient.put(`/goals/${selectedGoalId}`, updatedGoal);
      updateGoal(updatedGoal); // Update in the store for immediate UI update
      setIsEditing(false);
      setIsSaving(false);
      setSelectedGoalId(null);
      setEditedTitle('');
      setEditedTarget('');
    } catch (error) {
      console.error('Error updating goal:', error);
      setError('Failed to update goal. Please try again.');
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedGoalId(null);
    setEditedTitle('');
    setEditedTarget('');
  };

  return (
    <div className={styles.goalListContainer}>
      {isLoading ? (
        <p>Loading goals...</p>
      ) : (
        <>
          <ul className={styles.goalList}>
            {goals.map((goal) => (
              <GoalListItem
                key={goal.id}
                goal={goal}
                onDelete={handleDeleteGoal}
                onEdit={handleEditGoal}
              />
            ))}
          </ul>
          {isEditing && (
            <Modal isOpen={isEditing} onClose={handleCancelEdit}>
              <div className="mb-4">
                <label htmlFor="edit-title" className="block text-gray-700 font-bold mb-2">
                  Title:
                </label>
                <Input
                  id="edit-title"
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edit-target" className="block text-gray-700 font-bold mb-2">
                  Target:
                </label>
                <Input
                  id="edit-target"
                  type="text"
                  value={editedTarget}
                  onChange={(e) => setEditedTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <Button
                  variant="primary"
                  disabled={isSaving}
                  onClick={handleSaveEdit}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default GoalList;
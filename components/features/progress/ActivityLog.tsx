"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { Activity } from '@/types';
import { apiClient } from '@/lib/api/client';
import { getFormattedDate } from '@/lib/utils/formatters';
import styles from './ActivityLog.module.css';

interface ActivityLogProps {
  activities: Activity[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const { user } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiClient.get('/progress', {
          params: { userId: user?.id },
        });

        useStore.setState({ activities: response.data });
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to fetch activities. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchActivities();
    }
  }, [user]);

  if (isLoading) {
    return <p className={styles.loading}>Loading activities...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <ul className={styles.activityLog}>
      {activities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((activity) => (
          <li key={activity.id} className={styles.activityItem}>
            <div className={styles.activityDate}>
              {getFormattedDate(activity.date)}
            </div>
            <div className={styles.activityDetails}>
              <span className={styles.activityType}>{activity.type}</span>
              <span className={styles.activityDuration}>
                Duration: {activity.duration} minutes
              </span>
            </div>
          </li>
        ))}
    </ul>
  );
};

export default ActivityLog;
import { Activity, Goal } from "@/types";

export const getFormattedDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const formatDuration = (duration: number): string => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  let formattedDuration = "";
  if (hours > 0) {
    formattedDuration += `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) {
      formattedDuration += ` ${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
  } else {
    formattedDuration += `${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  return formattedDuration;
};

export const processData = (activities: Activity[], goals: Goal[]): any[] => {
  const groupedActivities = activities.reduce((acc: any, activity) => {
    const goal = goals.find((g) => g.id === activity.goalId);
    if (goal) {
      const dateKey = activity.date.toLocaleDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = {};
      }
      acc[dateKey][goal.title] = (acc[dateKey][goal.title] || 0) + activity.duration;
    }
    return acc;
  }, {});

  return Object.entries(groupedActivities).map(([date, goalDurations]) => ({
    date: new Date(date),
    ...goalDurations,
  }));
};
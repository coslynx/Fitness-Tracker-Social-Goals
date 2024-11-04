import { getFormattedDate, formatDuration, processData } from '../../lib/utils/formatters';
import { Activity, Goal } from '@/types';

describe('Formatters', () => {
  describe('getFormattedDate', () => {
    it('should format a Date object into a localized string', () => {
      const date = new Date('2023-10-26');
      const formattedDate = getFormattedDate(date);
      expect(formattedDate).toBe('10/26/2023');
    });

    it('should handle invalid Date objects', () => {
      const date = new Date('invalid-date');
      const formattedDate = getFormattedDate(date);
      expect(formattedDate).toBe('Invalid Date');
    });
  });

  describe('formatDuration', () => {
    it('should format duration in minutes correctly', () => {
      const duration = 65;
      const formattedDuration = formatDuration(duration);
      expect(formattedDuration).toBe('1 hour 5 minutes');
    });

    it('should format duration in hours correctly', () => {
      const duration = 120;
      const formattedDuration = formatDuration(duration);
      expect(formattedDuration).toBe('2 hours');
    });

    it('should format duration less than 60 minutes correctly', () => {
      const duration = 45;
      const formattedDuration = formatDuration(duration);
      expect(formattedDuration).toBe('45 minutes');
    });

    it('should handle invalid duration values', () => {
      const duration = -10;
      const formattedDuration = formatDuration(duration);
      expect(formattedDuration).toBe('Invalid Duration');
    });
  });

  describe('processData', () => {
    it('should process activities and goals data correctly', () => {
      const goals: Goal[] = [
        { id: 1, title: 'Lose 10 lbs', target: '150 lbs', userId: 1, createdAt: new Date() },
        { id: 2, title: 'Run 5km daily', target: '30 minutes', userId: 1, createdAt: new Date() },
      ];
      const activities: Activity[] = [
        { id: 1, type: 'Running', date: new Date('2023-10-26'), duration: 30, goalId: 1, userId: 1 },
        { id: 2, type: 'Cycling', date: new Date('2023-10-25'), duration: 45, goalId: 2, userId: 1 },
        { id: 3, type: 'Running', date: new Date('2023-10-26'), duration: 20, goalId: 1, userId: 1 },
      ];
      const processedData = processData(activities, goals);
      expect(processedData).toEqual([
        { date: new Date('2023-10-25'), 'Run 5km daily': 45 },
        { date: new Date('2023-10-26'), 'Lose 10 lbs': 50, 'Run 5km daily': 0 },
      ]);
    });

    it('should handle cases where activities and goals are not properly associated', () => {
      const goals: Goal[] = [
        { id: 1, title: 'Lose 10 lbs', target: '150 lbs', userId: 1, createdAt: new Date() },
      ];
      const activities: Activity[] = [
        { id: 1, type: 'Running', date: new Date('2023-10-26'), duration: 30, goalId: 999, userId: 1 },
      ];
      const processedData = processData(activities, goals);
      expect(processedData).toEqual([]);
    });
  });
});
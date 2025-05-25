import { ref } from 'vue';
import { usePokerStatistics } from './usePokerStatistics';
import type { Estimate } from '~/types';

// Helper function to create Estimate objects
const createEstimate = (value: number | string, userId: string = 'test-user', userName: string = 'Test User'): Estimate => ({
  userId,
  userName,
  value,
});

describe('usePokerStatistics', () => {
  // Default inputs for most tests
  const estimates = ref<Estimate[]>([]);
  const isOpen = ref(false);

  // Reset values before each test
  beforeEach(() => {
    estimates.value = [];
    isOpen.value = false;
  });

  describe('Initial State / Cards Closed (isOpen = false)', () => {
    it('should return null for all statistics when isOpen is false', () => {
      estimates.value = [createEstimate(1), createEstimate(2), createEstimate(3)];
      // isOpen is already false by default beforeEach
      const { average, median, min, max, mode } = usePokerStatistics(estimates, isOpen);
      expect(average.value).toBeNull();
      expect(median.value).toBeNull();
      expect(min.value).toBeNull();
      expect(max.value).toBeNull();
      expect(mode.value).toBeNull(); // Or specific empty state if defined differently
    });
  });

  describe('Average Calculation', () => {
    beforeEach(() => {
      isOpen.value = true; // Open cards for these tests
    });

    it('should return null for average when estimates array is empty', () => {
      const { average } = usePokerStatistics(estimates, isOpen);
      expect(average.value).toBeNull();
    });

    it('should calculate average correctly for numeric estimates', () => {
      estimates.value = [createEstimate(2), createEstimate(4), createEstimate(6)];
      const { average } = usePokerStatistics(estimates, isOpen);
      expect(average.value).toBe(4);
    });

    it('should calculate average correctly ignoring non-numeric estimates', () => {
      estimates.value = [createEstimate(2), createEstimate('coffee'), createEstimate(4)];
      const { average } = usePokerStatistics(estimates, isOpen);
      expect(average.value).toBe(3);
    });

    it('should return null for average when all estimates are non-numeric', () => {
      estimates.value = [createEstimate('coffee'), createEstimate('?')];
      const { average } = usePokerStatistics(estimates, isOpen);
      expect(average.value).toBeNull();
    });
  });

  describe('Median Calculation', () => {
    beforeEach(() => {
      isOpen.value = true;
    });

    it('should return null for median when estimates array is empty', () => {
      const { median } = usePokerStatistics(estimates, isOpen);
      expect(median.value).toBeNull();
    });

    it('should calculate median correctly for an odd number of numeric estimates', () => {
      estimates.value = [createEstimate(7), createEstimate(2), createEstimate(3)]; // Unsorted
      const { median } = usePokerStatistics(estimates, isOpen);
      expect(median.value).toBe(3);
    });

    it('should calculate median correctly for an even number of numeric estimates', () => {
      estimates.value = [createEstimate(7), createEstimate(8), createEstimate(2), createEstimate(3)]; // Unsorted
      const { median } = usePokerStatistics(estimates, isOpen);
      expect(median.value).toBe(5); // (3+7)/2
    });

    it('should calculate median correctly ignoring non-numeric estimates', () => {
      estimates.value = [createEstimate(2), createEstimate('coffee'), createEstimate(7)];
      const { median } = usePokerStatistics(estimates, isOpen);
      expect(median.value).toBe(4.5); // (2+7)/2
    });

     it('should return null for median when all estimates are non-numeric', () => {
      estimates.value = [createEstimate('coffee'), createEstimate('?')];
      const { median } = usePokerStatistics(estimates, isOpen);
      expect(median.value).toBeNull();
    });
  });

  describe('Min Calculation', () => {
    beforeEach(() => {
      isOpen.value = true;
    });

    it('should return null for min when estimates array is empty', () => {
      const { min } = usePokerStatistics(estimates, isOpen);
      expect(min.value).toBeNull();
    });

    it('should calculate min correctly for numeric estimates', () => {
      estimates.value = [createEstimate(2), createEstimate(0), createEstimate(7)];
      const { min } = usePokerStatistics(estimates, isOpen);
      expect(min.value).toBe(0);
    });

    it('should calculate min correctly ignoring non-numeric estimates', () => {
      estimates.value = [createEstimate(2), createEstimate('coffee'), createEstimate(7)];
      const { min } = usePokerStatistics(estimates, isOpen);
      expect(min.value).toBe(2);
    });

    it('should return null for min when all estimates are non-numeric', () => {
      estimates.value = [createEstimate('coffee'), createEstimate('?')];
      const { min } = usePokerStatistics(estimates, isOpen);
      expect(min.value).toBeNull();
    });
  });

  describe('Max Calculation', () => {
    beforeEach(() => {
      isOpen.value = true;
    });

    it('should return null for max when estimates array is empty', () => {
      const { max } = usePokerStatistics(estimates, isOpen);
      expect(max.value).toBeNull();
    });

    it('should calculate max correctly for numeric estimates', () => {
      estimates.value = [createEstimate(2), createEstimate(0), createEstimate(7)];
      const { max } = usePokerStatistics(estimates, isOpen);
      expect(max.value).toBe(7);
    });

    it('should calculate max correctly ignoring non-numeric estimates', () => {
      estimates.value = [createEstimate(2), createEstimate('coffee'), createEstimate(7)];
      const { max } = usePokerStatistics(estimates, isOpen);
      expect(max.value).toBe(7);
    });

    it('should return null for max when all estimates are non-numeric', () => {
      estimates.value = [createEstimate('coffee'), createEstimate('?')];
      const { max } = usePokerStatistics(estimates, isOpen);
      expect(max.value).toBeNull();
    });
  });

  describe('Mode Calculation', () => {
    beforeEach(() => {
      isOpen.value = true;
    });

    it('should return null for mode when estimates array is empty', () => {
      const { mode } = usePokerStatistics(estimates, isOpen);
      expect(mode.value).toBeNull();
    });

    it('should calculate mode for a single numeric mode', () => {
      estimates.value = [createEstimate(2), createEstimate(2), createEstimate(7)];
      const { mode } = usePokerStatistics(estimates, isOpen);
      expect(mode.value).toEqual([2]);
    });

    it('should calculate mode for a single string mode', () => {
      estimates.value = [createEstimate('coffee'), createEstimate('coffee'), createEstimate(7)];
      const { mode } = usePokerStatistics(estimates, isOpen);
      expect(mode.value).toEqual(['coffee']);
    });

    it('should calculate mode for multiple modes (numeric)', () => {
      estimates.value = [createEstimate(2), createEstimate(2), createEstimate(7), createEstimate(7), createEstimate(3)];
      const { mode } = usePokerStatistics(estimates, isOpen);
      expect(mode.value).toEqual(expect.arrayContaining([2, 7]));
      expect(mode.value?.length).toBe(2);
    });
    
    it('should calculate mode for multiple modes (mixed types)', () => {
      estimates.value = [createEstimate(5), createEstimate('coffee'), createEstimate(5), createEstimate('coffee'), createEstimate(3)];
      const { mode } = usePokerStatistics(estimates, isOpen);
      expect(mode.value).toEqual(expect.arrayContaining([5, 'coffee']));
      expect(mode.value?.length).toBe(2);
    });

    it('should return null for mode when all values are unique and more than 1 estimate', () => {
      estimates.value = [createEstimate(1), createEstimate(2), createEstimate(3)];
      const { mode } = usePokerStatistics(estimates, isOpen);
      expect(mode.value).toBeNull();
    });
    
    it('should return null for mode when all values are unique (mixed types) and more than 1 estimate', () => {
      estimates.value = [createEstimate(1), createEstimate('coffee'), createEstimate(3)];
      const { mode } = usePokerStatistics(estimates, isOpen);
      expect(mode.value).toBeNull();
    });

    it('should return null when all estimates are modes (e.g., [1, 2, "?"] - all appear once)', () => {
      estimates.value = [createEstimate(1), createEstimate(2), createEstimate('?')];
      const { mode } = usePokerStatistics(estimates, isOpen);
      // This specific case is handled by: if (modes.length === estimates.value.length && estimates.value.length > 1) return null
      // Each value is a "mode" of frequency 1.
      expect(mode.value).toBeNull();
    });

    it('should return modes when counts are equal but not all items are unique (e.g. [1,1,2,2])', () => {
        estimates.value = [createEstimate(1), createEstimate(1), createEstimate(2), createEstimate(2)];
        const { mode } = usePokerStatistics(estimates, isOpen);
        expect(mode.value).toEqual(expect.arrayContaining([1,2]));
        expect(mode.value?.length).toBe(2);
    });
    
    it('should calculate mode for a single estimate', () => {
      estimates.value = [createEstimate(5)];
      const { mode } = usePokerStatistics(estimates, isOpen);
      expect(mode.value).toEqual([5]);
    });

    it('should calculate mode for a single string estimate', () => {
      estimates.value = [createEstimate('coffee')];
      const { mode } = usePokerStatistics(estimates, isOpen);
      expect(mode.value).toEqual(['coffee']);
    });
  });
});

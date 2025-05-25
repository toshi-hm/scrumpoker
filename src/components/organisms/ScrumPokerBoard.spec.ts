import { mount, VueWrapper } from '@vue/test-utils';
import { ref, nextTick } from 'vue';
import ScrumPokerBoard from './ScrumPokerBoard.vue';
import EstimationInput from '../molecules/EstimationInput.vue';
import StatisticsDisplay from '../molecules/StatisticsDisplay.vue';
import BaseButton from '../atoms/BaseButton.vue';
import type { Estimate } from '~/types';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234')
}));

// Mock usePokerStatistics
const mockPokerStatistics = {
  average: ref<number | null>(null),
  median: ref<number | null>(null),
  min: ref<number | null>(null),
  max: ref<number | null>(null),
  mode: ref<(number|string)[] | null>([])
};
jest.mock('../../composables/usePokerStatistics', () => ({
  usePokerStatistics: jest.fn(() => mockPokerStatistics)
}));

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});


describe('ScrumPokerBoard.vue', () => {
  let wrapper: VueWrapper<any>;

  // Constants for sessionStorage keys
  const ESTIMATES_STORAGE_KEY = 'scrumpoker-estimates';
  const IS_OPEN_STORAGE_KEY = 'scrumpoker-isOpen';
  const USER_ID_STORAGE_KEY = 'scrumpoker-userId';
  const USER_NAME_STORAGE_KEY_PREFIX = 'scrumpoker-userName-';

  beforeEach(async () => {
    // Reset mocks and sessionStorage before each test
    jest.clearAllMocks();
    mockSessionStorage.clear();
    // Reset mocked composable values
    mockPokerStatistics.average.value = null;
    mockPokerStatistics.median.value = null;
    mockPokerStatistics.min.value = null;
    mockPokerStatistics.max.value = null;
    mockPokerStatistics.mode.value = [];


    // Clear mocks for uuid.v4 before each test in this describe block if needed,
    // or manage more granularly if tests interfere.
    // jest.clearAllMocks() in the global beforeEach should handle this.
    // Let's ensure uuid.v4 is reset for the specific test that checks no call.

    wrapper = mount(ScrumPokerBoard);
    await nextTick(); // Wait for onMounted to complete
  });

  describe('Initial Render & User ID', () => {
    it('generates a new user ID if not in sessionStorage', () => {
      // This test expects uuid.v4 to be called.
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith(USER_ID_STORAGE_KEY);
      expect(require('uuid').v4).toHaveBeenCalled();
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(USER_ID_STORAGE_KEY, 'test-uuid-1234');
      expect(wrapper.vm.currentUserId).toBe('test-uuid-1234');
    });

    it('loads an existing user ID from sessionStorage', async () => {
      // Clear any previous calls to uuid.v4 from other tests
      require('uuid').v4.mockClear(); 
      
      mockSessionStorage.setItem(USER_ID_STORAGE_KEY, 'existing-user-id');
      
      // Re-mount the component to trigger onMounted with pre-set sessionStorage
      // We need a new wrapper instance for this test to isolate onMounted behavior
      const localWrapper = mount(ScrumPokerBoard);
      await nextTick();

      expect(mockSessionStorage.getItem).toHaveBeenCalledWith(USER_ID_STORAGE_KEY);
      expect(require('uuid').v4).not.toHaveBeenCalled(); // Should not generate new UUID
      expect(localWrapper.vm.currentUserId).toBe('existing-user-id');
    });

    it('renders the userName input', () => {
      const userNameInput = wrapper.find('input[type="text"].user-name-input');
      expect(userNameInput.exists()).toBe(true);
    });
  });

  describe('Estimate Submission (handleSelect)', () => {
    const testUserName = 'Test User';
    const testEstimateValue = 5;

    beforeEach(async () => {
      // Set a username
      const userNameInput = wrapper.find('input[type="text"].user-name-input');
      await userNameInput.setValue(testUserName);
      expect(wrapper.vm.userName).toBe(testUserName);
    });

    it('adds a new estimate and updates sessionStorage', async () => {
      // Simulate estimate selection through EstimationInput
      const estimationInput = wrapper.findComponent(EstimationInput);
      await estimationInput.vm.$emit('select', testEstimateValue);
      await nextTick();

      const expectedEstimate: Estimate = {
        userId: 'test-uuid-1234',
        userName: testUserName,
        value: testEstimateValue
      };
      expect(wrapper.vm.estimates).toEqual([expectedEstimate]);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        `${USER_NAME_STORAGE_KEY_PREFIX}test-uuid-1234`,
        testUserName
      );
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        ESTIMATES_STORAGE_KEY,
        JSON.stringify([expectedEstimate])
      );
    });

    it('updates an existing estimate for the same user and updates sessionStorage', async () => {
      // First estimate
      await wrapper.findComponent(EstimationInput).vm.$emit('select', testEstimateValue);
      await nextTick();

      // Second estimate (update)
      const updatedEstimateValue = 8;
      await wrapper.findComponent(EstimationInput).vm.$emit('select', updatedEstimateValue);
      await nextTick();
      
      const expectedEstimate: Estimate = {
        userId: 'test-uuid-1234',
        userName: testUserName,
        value: updatedEstimateValue
      };
      expect(wrapper.vm.estimates).toEqual([expectedEstimate]); // Should update, not add
      expect(wrapper.vm.estimates.length).toBe(1);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        ESTIMATES_STORAGE_KEY,
        JSON.stringify([expectedEstimate])
      );
    });
  });

  describe('Clearing Estimates (clearEstimates)', () => {
    beforeEach(async () => {
      // Add some estimates
      await wrapper.find('input[type="text"].user-name-input').setValue('User1');
      await wrapper.findComponent(EstimationInput).vm.$emit('select', 3);
      // Simulate another user or another estimate for the same user if needed
      // For simplicity, we'll just ensure estimates array is not empty
      expect(wrapper.vm.estimates.length).toBeGreaterThan(0);
      wrapper.vm.isOpen = true; // Set cards to open
      await nextTick();
    });

    it('clears estimates, closes cards, and removes from sessionStorage', async () => {
      const clearButton = wrapper.findAllComponents(BaseButton).find(b => b.props('label') === 'CLEAR');
      expect(clearButton?.exists()).toBe(true);
      await clearButton!.trigger('click'); // or .vm.$emit('click')
      await nextTick();

      expect(wrapper.vm.estimates).toEqual([]);
      expect(wrapper.vm.isOpen).toBe(false);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(ESTIMATES_STORAGE_KEY);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(IS_OPEN_STORAGE_KEY);
    });
  });

  describe('Opening Cards (openCards)', () => {
    it('opens cards, updates sessionStorage, and disables the OPEN button', async () => {
      const openButton = wrapper.findAllComponents(BaseButton).find(b => b.props('label') === 'OPEN');
      expect(openButton?.exists()).toBe(true);
      
      // Initially button should not be disabled
      // Check attribute directly as prop might be undefined
      expect(openButton!.attributes('disabled')).toBeUndefined();

      await openButton!.trigger('click');
      await nextTick();

      expect(wrapper.vm.isOpen).toBe(true);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(IS_OPEN_STORAGE_KEY, JSON.stringify(true));
      
      // Re-find button to check disabled state
      const updatedOpenButton = wrapper.findAllComponents(BaseButton).find(b => b.props('label') === 'OPEN');
      // When disabled, the attribute should exist (or prop should be true)
      expect(updatedOpenButton!.attributes('disabled')).toBeDefined();
      // Or, if the prop is explicitly set to true:
      // expect(updatedOpenButton!.props('disabled')).toBe(true);
    });
  });

  describe('Statistics Display', () => {
    it('passes mocked statistics to StatisticsDisplay component', async () => {
      const statsDisplay = wrapper.findComponent(StatisticsDisplay);
      expect(statsDisplay.exists()).toBe(true);

      expect(statsDisplay.props('average')).toBeNull(); // Initial from mock

      mockPokerStatistics.average.value = 5;
      await nextTick();
      expect(statsDisplay.props('average')).toBe(5);

      mockPokerStatistics.median.value = 3;
      await nextTick();
      expect(statsDisplay.props('median')).toBe(3);
      
      mockPokerStatistics.min.value = 1;
      await nextTick();
      expect(statsDisplay.props('min')).toBe(1);

      mockPokerStatistics.max.value = 10;
      await nextTick();
      expect(statsDisplay.props('max')).toBe(10);
      
      mockPokerStatistics.mode.value = [1, 5];
      await nextTick();
      expect(statsDisplay.props('mode')).toEqual([1, 5]);
    });
  });

  describe('Persistence', () => {
    const persistedUserId = 'persisted-user-id';
    const persistedUserName = 'Persisted User';
    const persistedEstimates: Estimate[] = [
      { userId: persistedUserId, userName: persistedUserName, value: 8 },
      { userId: 'another-user', userName: 'Another User', value: 'coffee' }
    ];
    const persistedIsOpen = true;

    beforeEach(() => {
      // Clear mocks for this specific describe block setup
      jest.clearAllMocks();
      mockSessionStorage.clear();

      // Pre-populate sessionStorage
      mockSessionStorage.setItem(USER_ID_STORAGE_KEY, persistedUserId);
      mockSessionStorage.setItem(`${USER_NAME_STORAGE_KEY_PREFIX}${persistedUserId}`, persistedUserName);
      mockSessionStorage.setItem(ESTIMATES_STORAGE_KEY, JSON.stringify(persistedEstimates));
      mockSessionStorage.setItem(IS_OPEN_STORAGE_KEY, JSON.stringify(persistedIsOpen));
    });

    it('loads estimates, isOpen state, and username from sessionStorage on mount', async () => {
      // Mount new wrapper to trigger onMounted with pre-populated sessionStorage
      const persistentWrapper = mount(ScrumPokerBoard);
      await nextTick(); // Wait for onMounted to complete

      expect(persistentWrapper.vm.currentUserId).toBe(persistedUserId);
      expect(persistentWrapper.vm.userName).toBe(persistedUserName);
      expect(persistentWrapper.vm.estimates).toEqual(persistedEstimates);
      expect(persistentWrapper.vm.isOpen).toBe(persistedIsOpen);

      // Verify sessionStorage.getItem was called for all relevant keys
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith(USER_ID_STORAGE_KEY);
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith(`${USER_NAME_STORAGE_KEY_PREFIX}${persistedUserId}`);
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith(ESTIMATES_STORAGE_KEY);
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith(IS_OPEN_STORAGE_KEY);
    });
  });
});

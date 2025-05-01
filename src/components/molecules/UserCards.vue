<script lang="ts" setup>
import PokerCard from '../atoms/PokerCard.vue';

interface Estimate {
  userId: string; // Or some identifier for the user
  value: number | string;
}

defineProps<{
  estimates: Estimate[];
  isOpen: boolean;
}>();
</script>

<template>
  <div class="user-cards">
    <PokerCard
      v-for="(estimate, index) in estimates"
      :key="index"
      :value="estimate.value"
      :is-open="isOpen"
    />
  </div>
</template>

<style lang="scss">
.user-cards {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 110px; // Ensure space even when empty
  margin-top: 20px;
  padding: 10px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  flex-wrap: wrap;
}
</style>

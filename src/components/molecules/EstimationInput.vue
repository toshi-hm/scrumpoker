<script lang="ts" setup>
import BaseButton from '../atoms/BaseButton.vue'

const fibonacci = [0, 0.5, 1, 2, 3, 5, 8, 13, 21]

const emit = defineEmits<{
    (e: 'select', value: number | string): void
}>()

const selectValue = (value: number | string) => {
    emit('select', value)
}
</script>

<template>
    <div class="estimation-input">
        <BaseButton v-for="num in fibonacci" :key="num" :label="String(num)" @click="selectValue(num)" />
        <BaseButton label="coffee" @click="selectValue('coffee')" />
    </div>
</template>

<style lang="scss">
.estimation-input {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
}
</style>

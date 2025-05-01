<script lang="ts" setup>
import BaseButton from '../atoms/BaseButton.vue'

const fibonacci = [0, 0.5, 1, 2, 3, 5, 8, 13, 21]

/**
 * @emits select - 見積もり値が選択されたときに発行されるイベント
 * @param {number | string} value - 選択された値
 */
const emit = defineEmits<{
    (e: 'select', value: number | string): void
}>()

/**
 * 見積もり値を選択し、イベントを発行します。
 * @param {number | string} value - 選択された値
 */
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
@use '../../assets/common/mixin' as m; // ミックスインをインポート

.estimation-input {
    margin-top: 20px;
    display: flex;
    gap: 8px; // SPのギャップ
    flex-wrap: wrap;
    justify-content: center;

    @include m.pc { // PC表示のスタイル
        gap: 10px;
    }
}
</style>

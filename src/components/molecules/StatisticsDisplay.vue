<script lang="ts" setup>
/**
 * @props {number | null} average - 見積もりの平均値
 * @props {number | null} median - 見積もりの中央値
 * @props {number | null} min - 見積もりの最小値
 * @props {number | null} max - 見積もりの最大値
 * @props {(number | string)[] | null} mode - 見積もりの最頻値
 */
defineProps<{
    average: number | null
    median: number | null
    min: number | null
    max: number | null
    mode: (number | string)[] | null
}>()
</script>

<template>
    <div class="statistics-display">
        <span>Avg: {{ average?.toFixed(1) ?? '-' }}</span>
        <span>Median: {{ median ?? '-' }}</span>
        <span>Min: {{ min ?? '-' }}</span>
        <span>Max: {{ max ?? '-' }}</span>
        <span>Mode: {{ mode?.join(', ') || '-' }}</span>
    </div>
</template>

<style lang="scss">
.statistics-display {
    display: flex;
    gap: 15px;
    font-size: 14px;
    color: #555;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 4px;

    span {
        font-weight: bold;
    }
}
</style>

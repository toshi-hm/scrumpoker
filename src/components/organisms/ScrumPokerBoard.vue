<script lang="ts" setup>
import { ref, computed } from 'vue'
import BaseButton from '../atoms/BaseButton.vue'
import EstimationInput from '../molecules/EstimationInput.vue'
import UserCards from '../molecules/UserCards.vue'
import StatisticsDisplay from '../molecules/StatisticsDisplay.vue'

interface Estimate {
    userId: string // 仮のユーザーID
    value: number | string
}

const estimates = ref<Estimate[]>([])
const isOpen = ref(false)
let userIdCounter = 0 // 簡単なユーザーID生成用

const handleSelect = (value: number | string) => {
    // 実際のアプリケーションでは、認証されたユーザーIDを使用します
    const userId = `user-${userIdCounter++}`
    // 同じユーザーが再度選択した場合、更新する（ここでは単純に追加）
    estimates.value.push({ userId, value })
}

const clearEstimates = () => {
    estimates.value = []
    isOpen.value = false
    userIdCounter = 0 // リセット
}

const openCards = () => {
    isOpen.value = true
}

const numericEstimates = computed(() => {
    return estimates.value.map((e) => e.value).filter((v): v is number => typeof v === 'number')
})

const calculateAverage = computed(() => {
    if (!numericEstimates.value.length) return null
    const sum = numericEstimates.value.reduce((acc, val) => acc + val, 0)
    return sum / numericEstimates.value.length
})

const calculateMedian = computed(() => {
    if (!numericEstimates.value.length) return null
    const sorted = [...numericEstimates.value].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
})

const calculateMin = computed(() => {
    if (!numericEstimates.value.length) return null
    return Math.min(...numericEstimates.value)
})

const calculateMax = computed(() => {
    if (!numericEstimates.value.length) return null
    return Math.max(...numericEstimates.value)
})

const calculateMode = computed(() => {
    if (!estimates.value.length) return null
    const counts: Record<string | number, number> = {}
    let maxFreq = 0
    estimates.value.forEach((e) => {
        counts[e.value] = (counts[e.value] || 0) + 1
        if (counts[e.value] > maxFreq) {
            maxFreq = counts[e.value]
        }
    })

    if (maxFreq <= 1 && estimates.value.length > 1) return null // No unique mode or only one estimate

    const modes = Object.entries(counts)
        .filter(([_, freq]) => freq === maxFreq)
        .map(([valueStr]) => {
            // Try converting back to number if possible
            const num = Number(valueStr)
            return isNaN(num) ? valueStr : num
        })

    // If all values are unique and more than one estimate exists, technically no mode
    if (modes.length === estimates.value.length && estimates.value.length > 1) {
        return null
    }

    return modes.length > 0 ? modes : null
})
</script>

<template>
    <div class="scrum-poker-board">
        <header class="board-header">
            <StatisticsDisplay
                :average="calculateAverage"
                :median="calculateMedian"
                :min="calculateMin"
                :max="calculateMax"
                :mode="calculateMode"
            />
            <div class="controls">
                <BaseButton label="CLEAR" @click="clearEstimates" />
                <BaseButton label="OPEN" @click="openCards" :disabled="isOpen" />
            </div>
        </header>

        <UserCards :estimates="estimates" :is-open="isOpen" />

        <EstimationInput @select="handleSelect" />
    </div>
</template>

<style lang="scss">
.scrum-poker-board {
    padding: 20px;
    font-family: sans-serif;
}

.board-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap; // Allow wrapping on smaller screens
    gap: 10px; // Add gap between items
}

.controls {
    display: flex;
    gap: 10px;

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #eee; // Ensure disabled style is clear
    }
}

// Add some basic responsive adjustments if needed
@media (max-width: 600px) {
    .board-header {
        flex-direction: column;
        align-items: flex-start;
    }
    .controls {
        margin-top: 10px; // Add space when wrapped
    }
}
</style>

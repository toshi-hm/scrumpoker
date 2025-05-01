<script lang="ts" setup>
import { ref } from 'vue'
import BaseButton from '../atoms/BaseButton.vue'
import EstimationInput from '../molecules/EstimationInput.vue'
import UserCards from '../molecules/UserCards.vue'
import StatisticsDisplay from '../molecules/StatisticsDisplay.vue'
import { usePokerStatistics } from '../../composables/usePokerStatistics'

/**
 * ユーザーの見積もり情報を表すインターフェース
 * @interface Estimate
 * @property {string} userId - ユーザーID
 * @property {number | string} value - 見積もり値
 */
interface Estimate {
    userId: string
    value: number | string
}

/**
 * 現在の見積もりリスト
 * @type {Ref<Estimate[]>}
 */
const estimates = ref<Estimate[]>([])
/**
 * カードが開いているかどうかの状態
 * @type {Ref<boolean>}
 */
const isOpen = ref(false)
/**
 * 現在のユーザーID（仮）
 * @type {string}
 */
const currentUserId = 'current-user'

// usePokerStatistics に isOpen を渡す
const { average, median, min, max, mode } = usePokerStatistics(estimates, isOpen)

/**
 * 見積もり値が選択されたときのハンドラー
 * 既存の見積もりがあれば更新、なければ追加します。
 * @param {number | string} value - 選択された値
 */
const handleSelect = (value: number | string) => {
    const existingEstimateIndex = estimates.value.findIndex(
        (e) => e.userId === currentUserId
    )

    if (existingEstimateIndex !== -1) {
        estimates.value[existingEstimateIndex].value = value
    } else {
        estimates.value.push({ userId: currentUserId, value })
    }
}

/**
 * 全ての見積もりをクリアし、カードを閉じます。
 */
const clearEstimates = () => {
    estimates.value = []
    isOpen.value = false
}

/**
 * カードを開きます（見積もり値を表示します）。
 */
const openCards = () => {
    isOpen.value = true
}
</script>

<template>
    <div class="scrum-poker-board">
        <header class="board-header">
            <StatisticsDisplay
                :average="average"
                :median="median"
                :min="min"
                :max="max"
                :mode="mode"
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
    flex-wrap: wrap;
    gap: 10px;
}

.controls {
    display: flex;
    gap: 10px;

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: #eee;
    }
}

@media (max-width: 600px) {
    .board-header {
        flex-direction: column;
        align-items: flex-start;
    }
    .controls {
        margin-top: 10px;
    }
}
</style>

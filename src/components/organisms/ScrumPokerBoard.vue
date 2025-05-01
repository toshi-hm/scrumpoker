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
 * @property {string} userName - ユーザー名
 * @property {number | string} value - 見積もり値
 */
interface Estimate {
  userId: string
  userName: string // Add userName property
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
const userName = ref('')

// usePokerStatistics に isOpen を渡す
const { average, median, min, max, mode } = usePokerStatistics(estimates, isOpen)

/**
 * 見積もり値が選択されたときのハンドラー
 * 既存の見積もりがあれば更新、なければ追加します。
 * @param {number | string} value - 選択された値
 */
 const handleSelect = (value: number | string) => {
  const nameToUse = userName.value || `User-${currentUserId.slice(-4)}` // 入力がない場合はデフォルト名
  const existingEstimateIndex = estimates.value.findIndex((e) => e.userId === currentUserId)
  if (existingEstimateIndex !== -1) {
    // 既存の見積もりを更新（ユーザー名も更新）
    estimates.value[existingEstimateIndex].value = value
    estimates.value[existingEstimateIndex].userName = nameToUse
  } else {
    // 新しい見積もりを追加
    estimates.value.push({ userId: currentUserId, userName: nameToUse, value })
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
      <StatisticsDisplay :average="average" :median="median" :min="min" :max="max" :mode="mode" />
      <div class="controls">
        <input type="text" v-model="userName" placeholder="ユーザー名" class="user-name-input" />
        <BaseButton label="CLEAR" @click="clearEstimates" />
        <BaseButton label="OPEN" @click="openCards" :disabled="isOpen" />
      </div>
    </header>

    <UserCards :estimates="estimates" :is-open="isOpen" />

    <EstimationInput @select="handleSelect" />
  </div>
</template>

<style lang="scss" scoped>
@use '../../assets/common/mixin' as m; // ミックスインをインポート

.scrum-poker-board {
  padding: 10px; // SPのデフォルトパディング

  @include m.pc {
    // PC表示のスタイル
    padding: 20px;
  }
}

.board-header {
  display: flex;
  flex-direction: column; // SPのデフォルトは縦並び
  align-items: stretch; // SPでは幅いっぱいに
  margin-bottom: 15px;
  gap: 15px;

  @include m.pc {
    // PC表示のスタイル
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 10px;
  }
}

.controls {
  display: flex;
  gap: 10px;
  justify-content: flex-end; // SPでも右寄せにする場合
  align-items: center; // 要素を中央揃えにする

  @include m.pc {
    // PC表示のスタイル
    justify-content: flex-start; // PCではデフォルトの配置
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #eee;
  }
}

.user-name-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px; // ボタンとの間隔
  // 必要に応じて幅などを調整
  width: 150px;

  @include m.pc {
    margin-right: 20px; // ボタンとの間隔
  }
}
</style>

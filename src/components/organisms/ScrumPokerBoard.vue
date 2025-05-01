<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue' // onMounted をインポート
import { v4 as uuidv4 } from 'uuid' // uuid をインポート
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
 const currentUserId = ref('')
const userName = ref('')

// usePokerStatistics に isOpen を渡す
const { average, median, min, max, mode } = usePokerStatistics(estimates, isOpen)

// sessionStorage のキー
const ESTIMATES_STORAGE_KEY = 'scrumpoker-estimates'
const IS_OPEN_STORAGE_KEY = 'scrumpoker-isOpen' // isOpen 用のキーを追加
const USER_ID_STORAGE_KEY = 'scrumpoker-userId'
const USER_NAME_STORAGE_KEY_PREFIX = 'scrumpoker-userName-'

/**
 * 見積もり値が選択されたときのハンドラー
 */
 const handleSelect = (value: number | string) => {
  if (!currentUserId.value) return

  const nameToUse = userName.value || `User-${currentUserId.value.slice(-4)}`
  sessionStorage.setItem(`${USER_NAME_STORAGE_KEY_PREFIX}${currentUserId.value}`, nameToUse)

  const existingEstimateIndex = estimates.value.findIndex((e) => e.userId === currentUserId.value)
  if (existingEstimateIndex !== -1) {
    estimates.value[existingEstimateIndex].value = value
    estimates.value[existingEstimateIndex].userName = nameToUse
  } else {
    estimates.value.push({ userId: currentUserId.value, userName: nameToUse, value })
  }
}

/**
 * 全ての見積もりをクリアし、カードを閉じます。
 */
 const clearEstimates = () => {
  estimates.value = []
  isOpen.value = false
  // sessionStorage から estimates と isOpen データも削除
  sessionStorage.removeItem(ESTIMATES_STORAGE_KEY)
  sessionStorage.removeItem(IS_OPEN_STORAGE_KEY) // isOpen の状態も削除
}

/**
 * カードを開きます（見積もり値を表示します）。
 */
const openCards = () => {
  isOpen.value = true
}
// estimates の変更を監視して sessionStorage に保存
watch(estimates, (newEstimates) => {
  sessionStorage.setItem(ESTIMATES_STORAGE_KEY, JSON.stringify(newEstimates))
}, { deep: true }) // deep: true で配列内のオブジェクトの変更も検知
// isOpen の変更を監視して sessionStorage に保存
watch(isOpen, (newIsOpen) => {
  sessionStorage.setItem(IS_OPEN_STORAGE_KEY, JSON.stringify(newIsOpen))
})

// コンポーネントマウント時の処理
onMounted(() => {
  // ユーザーIDの取得・生成
  let userId = sessionStorage.getItem(USER_ID_STORAGE_KEY)
  if (!userId) {
    userId = uuidv4()
    sessionStorage.setItem(USER_ID_STORAGE_KEY, userId)
  }
  currentUserId.value = userId

  // ユーザー名の復元
  const storedUserName = sessionStorage.getItem(`${USER_NAME_STORAGE_KEY_PREFIX}${userId}`)
  if (storedUserName) {
    userName.value = storedUserName
  }

  // estimates の復元
  const storedEstimates = sessionStorage.getItem(ESTIMATES_STORAGE_KEY)
  if (storedEstimates) {
    try {
      estimates.value = JSON.parse(storedEstimates)
    } catch (e) {
      console.error('Failed to parse estimates from sessionStorage:', e)
      sessionStorage.removeItem(ESTIMATES_STORAGE_KEY) // パース失敗時はデータを削除
    }
  }

  // isOpen の復元
  const storedIsOpen = sessionStorage.getItem(IS_OPEN_STORAGE_KEY)
  if (storedIsOpen) {
    try {
      isOpen.value = JSON.parse(storedIsOpen)
    } catch (e) {
      console.error('Failed to parse isOpen from sessionStorage:', e)
      sessionStorage.removeItem(IS_OPEN_STORAGE_KEY) // パース失敗時はデータを削除
      isOpen.value = false // デフォルト値に戻す
    }
  } else {
    // 保存された値がない場合はデフォルトで閉じる
    isOpen.value = false
  }
})
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

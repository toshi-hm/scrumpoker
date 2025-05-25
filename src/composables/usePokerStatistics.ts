import { computed, type Ref } from 'vue'
import type { Estimate } from '~/types' // Estimate インターフェースをインポート

/**
 * スクラムポーカーの見積もり統計情報を計算するコンポーザブル関数
 * @param {Ref<Estimate[]>} estimates - 見積もりリストのリアクティブ参照
 * @param {Ref<boolean>} isOpen - カードが開いているかどうかのリアクティブ参照
 * @returns {{ average: Ref<number | null>, median: Ref<number | null>, min: Ref<number | null>, max: Ref<number | null>, mode: Ref<(number | string)[] | null> }} 統計情報のリアクティブ参照を含むオブジェクト
 */
export function usePokerStatistics(estimates: Ref<Estimate[]>, isOpen: Ref<boolean>) {
  /**
   * 数値の見積もりのみを抽出した計算済みプロパティ
   * @type {ComputedRef<number[]>}
   */
  const numericEstimates = computed(() => {
    if (!isOpen.value) return []
    return estimates.value.map((e) => e.value).filter((v): v is number => typeof v === 'number')
  })

  /**
   * 平均値を計算する計算済みプロパティ
   * @type {ComputedRef<number | null>}
   */
  const average = computed(() => {
    if (!isOpen.value || !numericEstimates.value.length) return null
    const sum = numericEstimates.value.reduce((acc, val) => acc + val, 0)
    return sum / numericEstimates.value.length
  })

  /**
   * 中央値を計算する計算済みプロパティ
   * @type {ComputedRef<number | null>}
   */
  const median = computed(() => {
    if (!isOpen.value || !numericEstimates.value.length) return null
    const sorted = [...numericEstimates.value].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  })

  /**
   * 最小値を計算する計算済みプロパティ
   * @type {ComputedRef<number | null>}
   */
  const min = computed(() => {
    if (!isOpen.value || !numericEstimates.value.length) return null
    return Math.min(...numericEstimates.value)
  })

  /**
   * 最大値を計算する計算済みプロパティ
   * @type {ComputedRef<number | null>}
   */
  const max = computed(() => {
    if (!isOpen.value || !numericEstimates.value.length) return null
    return Math.max(...numericEstimates.value)
  })

  /**
   * 最頻値を計算する計算済みプロパティ
   * @type {ComputedRef<(number | string)[] | null>}
   */
  const mode = computed(() => {
    if (!isOpen.value || !estimates.value.length) return null
    const counts: Record<string | number, number> = {}
    let maxFreq = 0
    estimates.value.forEach((e) => {
      counts[e.value] = (counts[e.value] || 0) + 1
      if (counts[e.value] > maxFreq) {
        maxFreq = counts[e.value]
      }
    })

    if (maxFreq <= 1 && estimates.value.length > 1) return null

    const modes = Object.entries(counts)
      .filter(([_, freq]) => freq === maxFreq)
      .map(([valueStr]) => {
        const num = Number(valueStr)
        return isNaN(num) ? valueStr : num
      })

    if (modes.length === estimates.value.length && estimates.value.length > 1) {
      return null
    }

    return modes.length > 0 ? modes : null
  })

  return {
    average,
    median,
    min,
    max,
    mode
  }
}

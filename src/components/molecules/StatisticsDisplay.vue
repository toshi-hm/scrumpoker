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

<style lang="scss" scoped>
@use '../../assets/common/mixin' as m; // ミックスインをインポート

.statistics-display {
  display: grid; // SPではグリッド表示で見やすくする
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); // 列を自動調整
  gap: 8px 10px; // SPでのギャップ (縦 横)
  font-size: 13px; // SPでのフォントサイズ
  padding: 8px; // SPでのパディング
  background-color: rgba(255, 255, 255, 0.15); // 背景色を薄く変更して緑の背景に対してコントラストを上げる
  color: #ffffff; // 文字色を白に
  border: 1px solid rgba(255, 255, 255, 0.3); // ボーダーを追加して視認性向上
  border-radius: 4px;

  @include m.pc {
    // PC表示のスタイル
    display: flex; // PCではフレックス表示に戻す
    gap: 15px;
    font-size: 14px;
    padding: 10px;
  }

  span {
    font-weight: bold;
    text-align: center; // グリッド表示のため中央揃え
    color: #ffffff; // 文字色を白く
    background-color: rgba(0, 0, 0, 0.2); // 少し暗い背景を追加してコントラスト向上
    padding: 4px 8px; // パディングを追加
    border-radius: 4px; // 角を丸くする

    @include m.pc {
      text-align: left; // PCでは左揃えに戻す
    }
  }
}
</style>

<script lang="ts" setup>
/**
 * @props {string | number} value - カードに表示する値（数値または"coffee"）
 * @props {boolean} isOpen - カードが開いているか（値が表示されているか）どうか
 */
defineProps<{
  value: string | number
  isOpen: boolean
}>()
</script>

<template>
  <div class="poker-card">
    <span v-if="isOpen">{{ value }}</span>
    <span v-else>?</span>
  </div>
</template>

<style lang="scss" scoped>
.poker-card {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 120px; /* 固定幅 (元の2倍) */
  height: 180px; /* 固定高さ (元の2倍) */
  border: 2px solid #cccccc; // ボーダーを太く
  border-radius: 8px;
  font-size: 32px; /* 固定フォントサイズ (元の2倍程度) */
  font-weight: bold;
  background-color: #ffffff; // 純白の背景
  color: #222222; // より濃い文字色
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2); // 影を強調
  margin: 5px; /* カード間のマージンを少し追加 */
  transition: all 0.2s ease; // アニメーション効果を追加
  cursor: pointer;
  box-sizing: border-box; /* paddingとborderをサイズ計算に含める */

  &:hover {
    transform: translateY(-3px); // ホバー時に少し浮き上がる効果
    box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
  }

  &.selected {
    border-color: #ffd700; // 選択されたカードは金色のボーダー
    box-shadow: 0 0 12px #ffd700; // 金色の光る効果
    transform: translateY(-5px); // より浮き上がる効果
  }
}
</style>

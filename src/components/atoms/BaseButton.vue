<script lang="ts" setup>
/**
 * @props {string} label - ボタンに表示するテキスト
 * @props {string} [icon] - ボタンに表示するアイコンのパス (オプション)
 */
defineProps<{
  label: string // セミコロンをカンマに変更
  icon?: string // セミコロンをカンマに変更 (任意プロパティなので末尾カンマは不要)
}>()

/**
 * @emits click - ボタンがクリックされたときに発行されるイベント
 */
const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button @click="emit('click')">
    <img v-if="icon" :src="icon" alt="" class="button-icon" />
    <!-- アイコンを表示 -->
    {{ label }}
  </button>
</template>

<style lang="scss" scoped>
button {
  padding: 20px 25px; // さらに縦方向のパディングを増やす
  border: 2px solid #ffffff; // 白い枠線に変更
  border-radius: 12px;
  cursor: pointer;
  background-color: #4CAF50; // より鮮やかな緑色に変更
  color: #ffffff; // 白色の文字
  font-size: 22px; // さらにフォントサイズを大きくする
  display: flex; // アイコンとラベルを横並びにする
  align-items: center; // 垂直方向中央揃え
  justify-content: center; // 水平方向中央揃え
  gap: 8px; // アイコンとラベルの間隔
  user-select: none; // テキスト選択を無効にする
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4); // テキストに影を追加して読みやすくする

  &:hover {
    background-color: #3e8e41; // ホバー時の色を調整
    border-color: #fff; // ホバー時にボーダーを白に
    transform: translateY(-2px); // ホバー時に少し浮き上がる効果
  }

  &:active {
    background-color: #3e8e41;
    transform: translateY(1px); // クリック時に少し押し込む効果
  }

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    border-color: #999999;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .button-icon {
    width: 24px; // アイコンのサイズ調整
    height: 24px;
  }
}
</style>

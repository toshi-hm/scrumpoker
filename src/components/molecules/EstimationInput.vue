<script lang="ts" setup>
import BaseButton from '../atoms/BaseButton.vue'
import CoffeeIcon from '../../assets/icon/icon-coffee.svg' // アイコンをインポート

const fibonacci = [0, 0.5, 1, 2, 3, 5, 8, 13, 21]

/**
 * @emits select - 見積もり値が選択されたときに発行されるイベント
 * @param {number | string} value - 選択された値
 */
const emit = defineEmits(['select']) // 配列構文に変更

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
        <BaseButton label="coffee" :icon="CoffeeIcon" @click="selectValue('Coffee')" /> <!-- アイコンパスを渡す -->
    </div>
</template>

<style lang="scss">
@use '../../assets/common/mixin' as m;

.estimation-input {
  margin-top: 20px;
  display: grid; // Grid レイアウトを使用
  justify-items: stretch; // グリッドアイテムを幅いっぱいに広げる（ボタンサイズ統一）
  gap: 8px;

  @include m.sp { // SP表示のスタイル (最大2列)
    grid-template-columns: repeat(2, 1fr);
  }

  @include m.pc { // PC表示のスタイル (5列 = 2行)
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }

  // BaseButtonコンポーネントがbutton要素をルートに持つことを想定
  // もしdivなどでラップされている場合はセレクタを調整
  ::v-deep(button) { // BaseButton内のbutton要素にスタイルを適用
    width: 100%; // グリッドセル幅いっぱいに広げる
    box-sizing: border-box; // パディングを含めて幅を計算
  }
}
</style>

<script lang="ts" setup>
import PokerCard from '../atoms/PokerCard.vue';

/**
 * ユーザーの見積もり情報を表すインターフェース
 * @interface Estimate
 * @property {string} userId - ユーザーID
 * @property {number | string} value - 見積もり値
 */
interface Estimate {
  userId: string;
  value: number | string;
}

/**
 * @props {Estimate[]} estimates - 表示する見積もりのリスト
 * @props {boolean} isOpen - カードが開いているかどうか
 */
defineProps<{
  estimates: Estimate[];
  isOpen: boolean;
}>();
</script>

<template>
  <div class="user-cards">
    <PokerCard
      v-for="(estimate, index) in estimates"
      :key="index"
      :value="estimate.value"
      :is-open="isOpen"
    />
  </div>
</template>

<style lang="scss">
@use '../../assets/common/mixin' as m; // ミックスインをインポート

.user-cards {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px; // SPでの最小高さを増やす
  margin-top: 15px;
  padding: 8px; // SPでのパディング
  border: 1px dashed #ccc;
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 8px; // カード間のギャップ

  @include m.pc { // PC表示のスタイル
    min-height: 300px; // PCでの最小高さを増やす
    margin-top: 20px;
    padding: 10px;
    gap: 10px; // PCでのカード間ギャップ
  }
}
</style>

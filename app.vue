<script lang="ts" setup>
import ScrumPokerBoard from './src/components/organisms/ScrumPokerBoard.vue'
</script>

<template>
    <ScrumPokerBoard />
</template>

<style lang="scss">
body {
  background-color: #1e3e2f; // より濃い緑色の背景に調整
  color: #ffffff; // 文字色を純白に維持
  margin: 0;
  font-family: sans-serif;
}

#app {
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

// ボタンやカードなどの要素がより視認しやすくなるようグローバルスタイルを追加
button {
  font-weight: bold;
}

// フォーカス状態のアウトラインを強調
*:focus {
  outline: 2px solid #ffd700;
  outline-offset: 2px;
}
</style>

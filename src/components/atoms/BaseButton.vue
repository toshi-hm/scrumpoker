<script lang="ts" setup>
/**
 * @props {string} label - ボタンに表示するテキスト
 * @props {string} [icon] - ボタンに表示するアイコンのパス (オプション)
 */
defineProps<{
    label: string, // セミコロンをカンマに変更
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
        <img v-if="icon" :src="icon" alt="" class="button-icon" /> <!-- アイコンを表示 -->
        {{ label }}
    </button>
</template>

<style lang="scss">
button {
    padding: 20px 25px; // さらに縦方向のパディングを増やす
    border: 1px solid #ccc;
    border-radius: 12px;
    cursor: pointer;
    background-color: #eee;
    font-size: 22px; // さらにフォントサイズを大きくする
    display: flex; // アイコンとラベルを横並びにする
    align-items: center; // 垂直方向中央揃え
    justify-content: center; // 水平方向中央揃え
    gap: 8px; // アイコンとラベルの間隔
    user-select: none; // テキスト選択を無効にする

    &:hover {
        background-color: #ddd;
    }

    .button-icon {
        width: 24px; // アイコンのサイズ調整
        height: 24px;
    }
}
</style>

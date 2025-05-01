<script lang="ts" setup>
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

<style lang="scss">
.poker-card {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 90px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px; // さらにフォントサイズを小さくする
    font-weight: bold;
    background-color: #fff;
    margin: 0 5px;
}

</style>

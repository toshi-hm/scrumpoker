<script lang="ts" setup>
defineProps<{
    label: string
}>()

const emit = defineEmits<{
    (e: 'click'): void
}>()
</script>

<template>
    <button @click="emit('click')">{{ label }}</button>
</template>

<style lang="scss">
button {
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background-color: #eee;

    &:hover {
        background-color: #ddd;
    }
}
</style>

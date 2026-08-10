<script setup lang="ts">
type Props = {
    primary?: boolean;
    secondary?: boolean;
    destructive?: boolean;
    disabled?: boolean;
};

const {
    primary = false,
    disabled = false,
    secondary = false,
    destructive = false,
} = defineProps<Props>();
</script>

<template>
    <button
        class="rounded px-4 py-2 cursor-pointer disabled:opacity-60 disabled:cursor-progress"
        :class="{
            'bg-teal-500 text-white': primary && !secondary && !destructive,
            'border border-teal-600 text-teal-600': secondary,
            'border border-red-600 text-red-600': destructive,
        }"
        :disabled="disabled"
        v-bind="$attrs"
    >
        <slot></slot>
    </button>
</template>

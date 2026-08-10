<template>
    <button
        v-bind="$attrs"
        class="rounded bg-linear-45 from-sunset-yellow via-sunset-coral to-sunset-pink text-gray-900 shadow-lg px-4 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
        <slot></slot>
    </button>
</template>

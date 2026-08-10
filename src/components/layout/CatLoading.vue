<script setup lang="ts">
import IconHeartOutline from "../icons/IconHeartOutline.vue";
import IconShare from "../icons/IconShare.vue";
import IconStar from "../icons/IconStar.vue";
</script>

<template>
    <div class="pb-8 w-full">
        <div
            class="aspect-square object-cover shadow-2xl h-full w-full rounded-lg block bg-gray-300 animate-pulse"
        ></div>
        <div class="flex gap-4 justify-between align-center px-2 py-4">
            <div class="flex gap-3 lg:gap-4">
                <button
                    class="cursor-pointer disabled:cursor-wait disabled:opacity-50"
                >
                    <IconHeartOutline />
                </button>

                <button>
                    <IconShare />
                </button>
            </div>

            <div class="flex gap-1 items-center" role="radiogroup">
                <button
                    v-for="n in 5"
                    :key="n"
                    type="button"
                    role="radio"
                    class="cursor-pointer disabled:cursor-wait disabled:opacity-50"
                >
                    <IconStar class="fill-none stroke-black" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, useModel, watch } from "vue";
import { RouterLink } from "vue-router";
import type { Breed } from "@/lib/breeds";

const dialog = ref<HTMLDialogElement | null>(null);

const props = defineProps<{ activeBreed: Breed | null }>();
const activeBreed = useModel(props, "activeBreed");

function onDialogClose() {
    activeBreed.value = null;
}

function onBackdropClick(event: MouseEvent) {
    if (event.target === dialog.value) {
        activeBreed.value = null;
    }
}

watch(activeBreed, () => {
    if (activeBreed?.value) {
        dialog?.value?.showModal();
        document.body.classList.add("overflow-hidden");
    } else {
        dialog?.value?.close();
        document.body.classList.remove("overflow-hidden");
    }
});

onUnmounted(() => {
    document.body.classList.remove("overflow-hidden");
});
</script>

<template>
    <dialog
        ref="dialog"
        @close="onDialogClose"
        @click="onBackdropClick"
        class="rounded-lg p-0 m-auto backdrop:bg-black/50"
    >
        <div v-if="activeBreed" class="w-full max-w-6xl p-4 lg:p-8 relative">
            <div class="flex justify-between pb-8">
                <h3 class="text-2xl font-semibold">
                    {{ activeBreed.name }}
                </h3>
                <button
                    aria-label="Close"
                    @click="activeBreed = null"
                    class="cursor-pointer text-gray-700 text-2xl hover:text-gray-500"
                >
                    ✕
                </button>
            </div>

            <div class="md:grid md:grid-cols-3 gap-8">
                <img
                    class="w-full rounded-lg col-span-2 shadow-lg max-md:mb-6"
                    :src="activeBreed.image.url"
                />
                <div class="h-full place-content-center space-y-4 pb-4">
                    <p>{{ activeBreed.description }}</p>
                    <p>
                        <strong>Temperament:</strong>
                        {{ activeBreed.temperament }}
                    </p>
                    <RouterLink
                        :to="`/?breed=${activeBreed.id}`"
                        class="underline text-teal-500 underline-offset-2"
                        >Show me cats in this breed</RouterLink
                    >
                </div>
            </div>
        </div>
    </dialog>
</template>

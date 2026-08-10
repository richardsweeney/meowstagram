<script setup lang="ts">
import { useTemplateRef, watch, watchEffect } from "vue";
import { RouterLink } from "vue-router";
import type { Breed } from "@/lib/breeds";

const dialogRef = useTemplateRef<HTMLDialogElement>("dialog");
const activeBreed = defineModel<Breed | null>("activeBreed", {
    required: true,
});

function onDialogClose() {
    activeBreed.value = null;
}

function onBackdropClick(event: MouseEvent) {
    if (event.target === dialogRef.value) {
        activeBreed.value = null;
    }
}

watch(
    activeBreed,
    () => {
        if (activeBreed.value) {
            if (!dialogRef.value?.open) {
                dialogRef.value?.showModal();
                document.body.classList.add("overflow-hidden");
            }
        } else {
            dialogRef.value?.close();
            document.body.classList.remove("overflow-hidden");
        }
    },
    { immediate: true, flush: "post" },
);

watchEffect((onCleanup) => {
    if (!activeBreed.value) {
        return;
    }
    document.body.classList.add("overflow-hidden");

    onCleanup(() => document.body.classList.remove("overflow-hidden"));
});
</script>

<template>
    <dialog
        ref="dialog"
        @close="onDialogClose"
        @click="onBackdropClick"
        class="rounded-lg p-0 m-auto backdrop:bg-black/50"
    >
        <div v-if="activeBreed" class="w-full max-w-2xl p-4 lg:p-8 relative">
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

            <div>
                <img
                    class="w-full aspect-square h-full object-cover rounded-lg col-span-2 shadow-lg mb-6"
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

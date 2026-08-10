<script setup lang="ts">
import { api } from "@/lib/api";
import type { Breed } from "@/lib/breeds";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { computed, ref, useTemplateRef, watch } from "vue";

const LIMIT = 24;

const activeBreed = ref<Breed | null>(null);
const dialog = useTemplateRef<HTMLDialogElement>("dialog");

const setActiveBreed = (breed: Breed) => (activeBreed.value = breed);

watch(activeBreed, (breed) => {
    if (breed) {
        dialog.value?.showModal();
    } else {
        dialog.value?.close();
    }
});

const onDialogClose = () => {
    activeBreed.value = null;
};

const onBackdropClick = (event: MouseEvent) => {
    if (event.target === dialog.value) {
        dialog.value?.close();
    }
};

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<Breed[]>({
        queryKey: ["breeds"],
        queryFn: ({ pageParam, signal }) =>
            api(`/breeds?limit=${LIMIT}&page=${pageParam}&attach_image=1`, {
                signal,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === LIMIT ? allPages.length : undefined,
    });

const breeds = computed(() => data.value?.pages?.flat() || []);
</script>

<template>
    <div>
        <div>
            <div v-if="isLoading" class="grid grid-cols-2 gap-4">
                <div
                    v-for="n in 12"
                    :key="n"
                    class="relative block w-full overflow-hidden rounded-lg shadow-2xl h-full aspect-square transition-all bg-gray-400 animate-pulse cursor-pointer hover:scale-105"
                ></div>
            </div>
            <div v-else class="grid grid-cols-2 gap-4">
                <div v-for="breed in breeds" :key="breed.id">
                    <button
                        @click="setActiveBreed(breed)"
                        class="relative block w-full overflow-hidden rounded-lg shadow-2xl transition-all cursor-pointer hover:scale-105"
                    >
                        <img
                            v-if="breed?.image?.url"
                            class="aspect-square object-cover h-full w-full"
                            :src="breed?.image?.url"
                        />
                        <div
                            v-else
                            class="aspect-square h-full w-full bg-gray-500"
                        ></div>
                        <div
                            class="absolute inset-0 flex items-center justify-center bg-black/30 text-white font-semibold text-xl"
                        >
                            {{ breed.name }}
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="hasNextPage" class="mt-8 flex justify-center">
            <button
                class="rounded bg-linear-45 from-sunset-yellow via-sunset-coral to-sunset-pink text-gray-900 shadow-lg px-4 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isFetchingNextPage"
                @click="fetchNextPage()"
            >
                {{ isFetchingNextPage ? "Loading..." : "Load more" }}
            </button>
        </div>
    </div>

    <dialog
        ref="dialog"
        class="rounded-lg p-0 m-auto backdrop:bg-black/50"
        @close="onDialogClose"
        @click="onBackdropClick"
    >
        <div v-if="activeBreed" class="w-full max-w-6xl p-4 lg:p-8 relative">
            <div class="flex justify-between pb-8">
                <h3 class="text-2xl font-semibold">{{ activeBreed.name }}</h3>
                <button
                    @click="dialog?.close()"
                    class="cursor-pointer text-gray-700 text-2xl hover:text-gray-500"
                    aria-label="Close"
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

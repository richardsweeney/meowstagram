<script setup lang="ts">
import { computed, ref } from "vue";
import { api } from "@/lib/api";
import type { Breed } from "@/lib/breeds";
import { useInfiniteQuery } from "@tanstack/vue-query";
import BreedPopup from "../layout/BreedPopup.vue";
import Button from "../style/Button.vue";

const LIMIT = 24;

const activeBreed = ref<Breed | null>(null);
const setActiveBreed = (breed: Breed) => (activeBreed.value = breed);

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
                <Button :disabled="isFetchingNextPage" @click="fetchNextPage()">
                    {{ isFetchingNextPage ? "Loading..." : "Load more" }}
                </Button>
            </div>
        </div>

        <BreedPopup v-model:activeBreed="activeBreed" />
    </div>
</template>

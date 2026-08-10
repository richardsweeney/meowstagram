<script setup lang="ts">
import type { Cats } from "@/lib/cats";
import type { Breed } from "@/lib/breeds";

import { computed } from "vue";
import { api } from "@/lib/api";
import { useInfiniteQuery, useQuery } from "@tanstack/vue-query";
import CatItem from "../layout/CatItem.vue";
import { useRoute } from "vue-router";
import CatLoading from "../layout/CatLoading.vue";

const route = useRoute();
const breed = computed(() => (route.query.breed as string) || "");

const LIMIT = 8;

const {
    isLoading,
    isError,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
} = useInfiniteQuery<Cats>({
    queryKey: ["cats", breed],
    queryFn: ({ pageParam, signal }) =>
        api(
            `/images/search?limit=${LIMIT}&page=${pageParam}&breed_ids=${breed.value}`,
            { signal },
        ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
        lastPage.length === LIMIT ? allPages.length : null,
});

const { data: breedData, isEnabled: isBreedQueryEnabled } = useQuery<Breed>({
    queryKey: ["breed", breed],
    queryFn: () => api(`/breeds/${breed.value}`),
    enabled: () => !!breed.value,
});

const cats = computed(() => data.value?.pages.flat() ?? []);
</script>

<template>
    <CatLoading v-if="isLoading" v-for="n in LIMIT" :key="n" />
    <div v-else-if="isError">Error: {{ error }}</div>
    <div v-else>
        <div v-if="isBreedQueryEnabled">
            <div
                v-if="breedData"
                class="flex justify-between items-center pb-8"
            >
                <h2 class="text-2xl">
                    Cats in breed: <strong>{{ breedData.name }}</strong>
                </h2>
                <RouterLink
                    :to="{ path: '/' }"
                    class="underline text-teal-500 underline-offset-2"
                >
                    Back to all breeds
                </RouterLink>
            </div>
        </div>

        <CatItem v-for="cat in cats" :cat="cat" :key="cat.id" />

        <div v-if="hasNextPage" class="mt-8 flex justify-center">
            <button
                class="rounded bg-teal-500 text-white px-4 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isFetchingNextPage"
                @click="fetchNextPage()"
            >
                {{ isFetchingNextPage ? "Loading..." : "Load more" }}
            </button>
        </div>
    </div>
</template>

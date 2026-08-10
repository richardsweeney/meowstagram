<script setup lang="ts">
import type { Cats } from "@/lib/cats";
import type { Breed } from "@/lib/breeds";

import { computed } from "vue";
import { api } from "@/lib/api";
import { useInfiniteQuery, useQuery } from "@tanstack/vue-query";
import CatItem from "../layout/CatItem.vue";
import { useRoute } from "vue-router";
import CatLoading from "../layout/CatLoading.vue";
import Button from "../style/Button.vue";

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
    <div>
        <div
            v-if="isLoading"
            class="flex flex-col gap-2 lg:justify-between items-center pb-8"
        >
            <CatLoading v-for="n in 4" :key="n" />
        </div>
        <div v-else-if="isError">Error: {{ error }}</div>
        <div v-else>
            <div v-if="isBreedQueryEnabled">
                <div
                    v-if="breedData"
                    class="flex max-lg:flex-col gap-2 lg:justify-between items-center pb-8"
                >
                    <h2 class="text-2xl">
                        Cats in breed: <strong>{{ breedData?.name }}</strong>
                    </h2>
                    <RouterLink
                        :to="{ path: '/' }"
                        class="underline text-teal-500 underline-offset-2"
                    >
                        Show all cats
                    </RouterLink>
                </div>
            </div>

            <CatItem v-for="cat in cats" :cat="cat" :key="cat.id" />

            <div v-if="hasNextPage" class="mt-8 flex justify-center">
                <Button :disabled="isFetchingNextPage" @click="fetchNextPage()">
                    {{ isFetchingNextPage ? "Loading..." : "Load more" }}
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useFavourites } from "@/lib/favourites";
import { computed } from "vue";
import CatItem from "../layout/CatItem.vue";
import CatLoading from "../layout/CatLoading.vue";

const { favouriteQuery } = useFavourites();
const { data, isLoading, isError, error } = favouriteQuery;

const cats = computed(() => {
    const favourites = data.value ?? [];

    return favourites.map(({ image }) => ({
        ...image,
        liked: true,
    }));
});
</script>

<template>
    <div v-if="isLoading">
        <CatLoading v-if="isLoading" v-for="n in 6" :key="n" />
    </div>
    <div v-else-if="isError">Error: {{ error }}</div>
    <div v-else>
        <CatItem v-for="cat in cats" :cat="cat" :key="cat.id" />
    </div>
</template>

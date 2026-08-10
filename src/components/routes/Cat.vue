<script setup lang="ts">
import { api } from "@/lib/api";
import type { Cat } from "@/lib/cats";
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";
import CatItem from "../layout/CatItem.vue";

const route = useRoute();

const { data: cat, isLoading } = useQuery<Cat>({
    queryKey: ["cat", route.params.id],
    queryFn: ({ signal }) => api(`/images/${route.params.id}`, { signal }),
});
</script>

<template>
    <div v-if="isLoading">
        <p>Loading...</p>
    </div>
    <div v-else>
        <div v-if="cat">
            <CatItem :cat="cat" />
        </div>
        <div v-else>
            <p>No cat found.</p>
        </div>
    </div>
</template>

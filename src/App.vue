<script setup lang="ts">
import "./style.css";

import { useFavourites } from "./lib/favourites";
import { computed, ref, watch } from "vue";
import { useImages } from "./lib/images";
import { useRoute } from "vue-router";
import IconMenu from "./components/icons/IconMenu.vue";
import IconClose from "./components/icons/IconClose.vue";
import IconHome from "./components/icons/IconHome.vue";
import IconHeartOutline from "./components/icons/IconHeartOutline.vue";
import IconBreeds from "./components/icons/IconBreeds.vue";
import IconProfile from "./components/icons/IconProfile.vue";

const { favouriteQuery } = useFavourites();
const { myUploadedCats } = useImages();
const route = useRoute();

const numFavourites = computed(() => favouriteQuery?.data?.value?.length ?? 0);
const numImages = computed(() => myUploadedCats?.data?.value?.length ?? 0);

const isMenuOpen = ref(false);

watch(
    () => route.fullPath,
    () => {
        isMenuOpen.value = false;
    },
);

const menuLinks = computed(() => [
    { to: "/", label: "Home", icon: IconHome },
    { to: "/breeds", label: "Breeds", icon: IconBreeds },
    {
        to: "/favourites",
        label:
            numFavourites.value > 0
                ? `Favorites (${numFavourites.value})`
                : "Favorites",
        icon: IconHeartOutline,
    },
    {
        to: "/images",
        label: numImages.value > 0 ? `Profile (${numImages.value})` : "Profile",
        icon: IconProfile,
    },
]);
</script>

<template>
    <header
        class="sticky top-0 z-50 p-4 lg:px-8 bg-linear-to-r from-sunset-yellow to-sunset-coral text-gray-900 flex justify-between items-center shadow-xl"
    >
        <h1>
            <RouterLink
                to="/"
                class="text-xl lg:text-2xl font-light class flex gap-1.5 lg:gap-2 items-center"
            >
                <svg
                    aria-label="Meowstagram"
                    class="x1lliihq x1n2onr6 x5n08af text-black"
                    fill="currentColor"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                >
                    <title>Meowstagram</title>
                    <path
                        d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z"
                    ></path>
                </svg>
                Meowstagram</RouterLink
            >
        </h1>

        <button
            class="md:hidden cursor-pointer"
            :aria-expanded="isMenuOpen"
            aria-label="Toggle menu"
            @click="isMenuOpen = !isMenuOpen"
        >
            <IconClose v-if="isMenuOpen" />
            <IconMenu v-else />
        </button>

        <div class="hidden md:flex gap-8">
            <RouterLink
                v-for="link in menuLinks"
                :key="link.to"
                :to="link.to"
                class="flex gap-1.5 font-light underline-offset-5 hover:underline"
                activeClass="underline font-normal"
            >
                <component :is="link.icon" v-if="link.icon" />
                {{ link.label }}
            </RouterLink>
        </div>

        <div
            class="absolute top-full left-0 right-0 md:hidden grid transition-[grid-template-rows,opacity] duration-200 ease-out"
            :class="
                isMenuOpen
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
            "
            :inert="!isMenuOpen"
        >
            <div class="overflow-hidden">
                <div
                    class="bg-linear-to-r from-sunset-yellow to-sunset-coral text-gray-900 shadow-xl flex flex-col p-4 pb-6 gap-4"
                >
                    <RouterLink
                        v-for="link in menuLinks"
                        :key="link.to"
                        :to="link.to"
                        class="flex gap-2 underline-offset-5 hover:underline"
                        activeClass="underline font-semibold"
                    >
                        <component :is="link.icon" v-if="link.icon" />
                        {{ link.label }}
                    </RouterLink>
                </div>
            </div>
        </div>
    </header>
    <div class="md:mt-8 p-4 lg:p-8 mx-auto max-w-2xl pb-32">
        <RouterView />
    </div>
</template>

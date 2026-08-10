<script setup lang="ts">
import type { Cat } from "@/lib/cats";

import { useFavourites } from "@/lib/favourites";
import { computed, ref } from "vue";
import { useImages } from "@/lib/images";
import { SUB_ID, useVotes } from "@/lib/votes";
import IconHeart from "../icons/IconHeart.vue";
import IconHeartOutline from "../icons/IconHeartOutline.vue";
import IconShare from "../icons/IconShare.vue";
import IconStar from "../icons/IconStar.vue";

const { cat } = defineProps<{ cat: Cat }>();

const { myUploadedCats, deleteImageMutation } = useImages();
const { mutate: deleteUserImage, isPending: deleteImagePending } =
    deleteImageMutation;

const userImage = computed(() =>
    myUploadedCats?.data?.value?.find(({ id }) => id === cat.id),
);

const { favouriteQuery, addFavourite, removeFavourite } = useFavourites();
const { data: favouriteData, isLoading: isLoadingFavourites } = favouriteQuery;
const { mutate: removeFavouriteMutation, isPending: removeFavouritePending } =
    removeFavourite;
const { mutate: addFavouriteMutation, isPending: addFavouritePending } =
    addFavourite;

const favourite = computed(() =>
    cat.id
        ? favouriteData?.value?.find(({ image_id }) => image_id === cat.id)
        : null,
);

const { voteQuery, rate } = useVotes();
const { data: voteData, isLoading: isLoadingVotes } = voteQuery;
const { mutate: rateCat, isPending: ratePending } = rate;

const vote = computed(() => {
    return voteData?.value?.find(
        ({ image_id, sub_id }) => image_id === cat.id && sub_id === SUB_ID,
    );
});

const hoverRating = ref<number | null>(null);

const displayRating = computed(
    () => hoverRating.value ?? vote.value?.value ?? 0,
);

const setRating = (value: number) => {
    rateCat({ imageId: cat.id, value });
};

const shareCat = async () => {
    const url = `${window.location.origin}/cat/${cat.id}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: "Meowstagram",
                text: "Check out this cat!",
                url,
            });
        } catch (err) {
            if ((err as Error).name !== "AbortError") {
                console.error(err);
            }
        }

        return;
    }

    await navigator.clipboard.writeText(url);
};

const toggleFavourite = () => {
    if (favourite.value) {
        removeFavouriteMutation(favourite.value.id);
    } else {
        addFavouriteMutation(cat.id);
    }
};

const isFavouritePending = computed(
    () => removeFavouritePending.value || addFavouritePending.value || false,
);

const deleteImage = () => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
        return;
    }

    deleteUserImage(cat.id as string, {
        onSuccess: () => {
            if (favourite?.value?.id) {
                removeFavouriteMutation(favourite.value.id as string);
            }
        },
    });
};
</script>

<template>
    <div class="relative pb-8 lg:pb-12">
        <img
            loading="lazy"
            :src="cat.url"
            alt="A Cat image"
            class="aspect-square object-cover shadow-2xl h-full w-full rounded-lg block"
        />
        <div class="flex gap-4 justify-between align-center px-2 py-4">
            <div class="flex gap-3 lg:gap-4">
                <button
                    @click="toggleFavourite"
                    :disabled="isFavouritePending || isLoadingFavourites"
                    class="cursor-pointer disabled:cursor-wait disabled:opacity-50"
                >
                    <IconHeart v-if="favourite" />
                    <IconHeartOutline v-else />
                </button>

                <button @click="shareCat">
                    <IconShare />
                </button>

                <button
                    v-if="userImage"
                    class="text-red-700 disabled:opacity-50 disabled:cursor-wait text-sm"
                    @click="deleteImage"
                    :disabled="deleteImagePending"
                >
                    <span class="max-md:hidden">Delete image</span>
                    <span class="md:hidden">Delete</span>
                </button>
            </div>

            <div
                class="flex gap-1 items-center"
                role="radiogroup"
                aria-label="Rate this cat"
                @mouseleave="hoverRating = null"
            >
                <button
                    v-for="n in 5"
                    :key="n"
                    type="button"
                    role="radio"
                    :aria-checked="n === vote?.value"
                    :aria-label="`Rate ${n} star${n > 1 ? 's' : ''}`"
                    class="cursor-pointer disabled:cursor-wait disabled:opacity-50"
                    :disabled="ratePending || isLoadingVotes"
                    @click="setRating(n)"
                    @mouseenter="hoverRating = n"
                >
                    <IconStar
                        :class="
                            n <= displayRating
                                ? 'fill-black stroke-black'
                                : 'fill-none stroke-black'
                        "
                    />
                </button>
            </div>
        </div>
    </div>
</template>

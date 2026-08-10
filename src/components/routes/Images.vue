<script setup lang="ts">
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { computed, ref, useTemplateRef } from "vue";
import { useImages } from "@/lib/images";
import CatItem from "../layout/CatItem.vue";
import CatLoading from "../layout/CatLoading.vue";
const { myUploadedCats } = useImages();
const { data, isLoading } = myUploadedCats;

const queryClient = useQueryClient();

const images = computed(() => {
    const cats = data?.value || [];

    return cats.map((cat) => ({
        ...cat,
        timestamp: new Date(cat.created_at).toLocaleString("sv-SE"),
        liked: false,
    }));
});

const uploadError = ref("");
const selectedFile = ref<File | null>(null);
const isDragging = ref(false);
const fileInput = useTemplateRef<HTMLInputElement>("fileInput");

const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: (formData: FormData) =>
        api("/images/upload", { method: "POST", body: formData }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["images"] }),
});

const setFile = (file: File | null | undefined) => {
    if (file && !file.type.startsWith("image/")) {
        uploadError.value = "Please choose an image file.";
        selectedFile.value = null;
        return;
    }

    uploadError.value = "";
    selectedFile.value = file ?? null;
};

const onFileChange = (e: Event) => {
    setFile((e.target as HTMLInputElement).files?.[0]);

    if (selectedFile.value) {
        upload(selectedFile.value);
    }
};

let dragCounter = 0;
const onDragEnter = () => {
    dragCounter++;
    isDragging.value = true;
};
const onDragLeave = () => {
    dragCounter = Math.max(0, dragCounter - 1);
    isDragging.value = dragCounter > 0;
};
const upload = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    uploadImage(formData, {
        onSuccess: () => {
            selectedFile.value = null;
            if (fileInput.value) {
                fileInput.value.value = "";
            }

            queryClient.invalidateQueries({ queryKey: ["myUploadedCats"] });
        },
    });
};

const onDrop = (e: DragEvent) => {
    dragCounter = 0;
    isDragging.value = false;
    setFile(e.dataTransfer?.files?.[0]);

    if (selectedFile.value) {
        upload(selectedFile.value);
    }
};
</script>

<template>
  <div>
    <h2 class="font-bold text-2xl pb-4">Upload your own cat image!</h2>
    <div
        class="border-2 border-dashed rounded-lg p-16 min-h-64 flex items-center justify-center text-center cursor-pointer transition-colors"
        :class="
            isDragging
                ? 'border-teal-500 bg-teal-50'
                : 'border-gray-300 bg-white'
        "
        @click="fileInput?.click()"
        @dragover.prevent
        @dragenter.prevent="onDragEnter"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
    >
        <input
            ref="fileInput"
            class="hidden"
            type="file"
            name="file"
            accept="image/*"
            @change="onFileChange"
        />
        <p v-if="isUploading" class="text-gray-500">Uploading...</p>
        <p v-else-if="selectedFile">{{ selectedFile.name }}</p>
        <p v-else class="text-gray-500">
            Drag & drop an image here, or click to browse
        </p>
    </div>
    <div v-if="uploadError" class="text-red-500 mt-2">{{ uploadError }}</div>

    <div class="pt-8">
        <div v-if="isLoading">
            <CatLoading v-if="isLoading" v-for="n in 4" :key="n" />
        </div>
        <div v-else class="space-y-4">
            <h3 class="text-2xl font-semibold">Your uploads</h3>
            <div v-if="!images.length">
                <strong>No images uploaded yet</strong>.<br />
                Use the upload form above to add your own awesome cat images!
            </div>
            <CatItem :cat="cat" v-for="cat in images" :key="cat.id" />
        </div>
    </div>
  </div>
</template>

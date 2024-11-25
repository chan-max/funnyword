<template>
  <div class="min-h-screen bg-black bg-opacity-90 py-8">
    <div class="container mx-auto px-4">
      <!-- Header Title -->
      <h1 class="text-3xl font-bold text-white mb-6 text-center">词库 共:{{ books.length }} </h1>

      <!-- Word Books Grid -->
      <div class="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        <div
          v-for="(item, index) in books"
          :key="item.id"
          class="relative group overflow-hidden rounded-md"
        >
          <!-- Cover Image with Inner Shadow -->
          <div class="relative overflow-hidden rounded-md" style="min-height: 140px;">
            <!-- Inner Shadow -->
            <div class="absolute inset-0 z-10 pointer-events-none inner-shadow"></div>

            <!-- Loading Placeholder -->
            <div
              v-show="loadingStates[index]"
              class="absolute inset-0 flex items-center justify-center bg-gray-700 animate-pulse z-20 px-4 py-16"
            >
              <span class="text-gray-500 text-xs">Loading...</span>
            </div>

            <!-- Image -->
            <img
              :src="item.cover"
              :alt="item.title"
              class="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105 z-0"
              @load="onImageLoad(index)"
              @error="onImageError(index)"
              v-show="!loadingStates[index]"
            />

            <!-- Hover Overlay (Detailed Info) -->
            <div
              class="absolute inset-0 bg-black bg-opacity-80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 z-30"
            >
              <!-- Book Origin -->
              <div class="text-xs text-gray-300 mb-2 italic">
                <p>{{ item.bookOrigin.originName || "Unknown" }}</p>
              </div>

              <!-- Word Count & Users -->
              <div class="text-xs text-gray-400 mb-2">
                <p>词数量: {{ item.wordNum }}</p>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1 mb-2">
                <span
                  v-for="tag in item.tags"
                  :key="tag.tagName"
                  class="bg-indigo-900 text-indigo-300 px-2 py-1 rounded-full text-xs"
                >
                  {{ tag.tagName }}
                </span>
              </div>

              <!-- View Details Button -->
              <NuxtLink
                :to="`/typing?lib=${item.id}`"
                class="block px-3 py-1 bg-indigo-500 text-white text-center rounded-md hover:bg-indigo-600 text-xs transition"
              >
                背单词
              </NuxtLink>
            </div>
          </div>

          <!-- Title (Always Visible) -->
          <div class="p-2 bg-black text-white text-sm font-medium text-center z-30">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { books } from "@/common/define/books"; // Example data import

// Loading states for each image
const loadingStates = ref(Array(books.length).fill(true));

// Mark image as loaded
const onImageLoad = (index) => {
  loadingStates.value[index] = false;
};

// Handle image loading error
const onImageError = (index) => {
  console.error(`Image failed to load for index ${index}`);
  loadingStates.value[index] = false; // Hide the placeholder even if the image fails to load
};
</script>

<style>
/* Inner shadow overlay */
.inner-shadow {
  box-shadow: inset 0 0 6px 5px #000;
  border-radius: inherit;
}

/* Smooth hover scaling */
.group:hover img {
  transform: scale(1.05);
}

/* Loading placeholder */
.bg-gray-700 {
  position: relative;
  overflow: hidden;
}
</style>

<style scoped>
/* Limit image overflow */
.relative {
  overflow: hidden; /* Ensure image stays inside its container */
}

/* Adjust hover scaling */
.group:hover img {
  transform: scale(1.05); /* Ensure it slightly enlarges but doesn't overflow */
}
</style>

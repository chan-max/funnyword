<template>
  <div class="min-h-screen bg-gray-900 bg-opacity-90 text-white p-4">
    <!-- Word Header -->
    <div v-if="targetWord" class="text-center mb-6">
      <h1 class="text-4xl font-bold">{{ targetWord.headWord }}</h1>
    </div>
    <div v-else class="text-center mb-6 text-gray-500">
      <h1 class="text-4xl font-bold">No Word Data Available</h1>
    </div>

    <div
      v-if="targetWord"
      class="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <!-- Central Content (Pronunciation and Translation) -->
      <div
        class="bg-gray-800 bg-opacity-75 p-6 rounded-md shadow-md col-span-full lg:col-span-2"
      >
        <!-- Pronunciation -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center space-x-8">
            <div>
              <p class="text-lg font-semibold">UK:</p>
              <p class="text-indigo-300">
                / {{ targetWord.content.word.content.ukphone || "-" }} /
              </p>
              <button
                @click="playVoice('uk')"
                class="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
              >
                ▶ Play UK
              </button>
            </div>
            <div>
              <p class="text-lg font-semibold">US:</p>
              <p class="text-indigo-300">
                / {{ targetWord.content.word.content.usphone || "-" }} /
              </p>
              <button
                @click="playVoice('us')"
                class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                ▶ Play US
              </button>
            </div>
          </div>
        </div>

        <!-- Translation -->
        <div>
          <h2 class="text-2xl font-semibold text-center mb-4">Translation</h2>
          <ul class="list-disc pl-10 space-y-2">
            <li
              v-for="(translation, index) in targetWord.content.word.content.trans || []"
              :key="index"
              class="text-sm"
            >
              <span class="font-bold">{{ translation.pos || "N/A" }}</span
              >: {{ translation.tranCn || "N/A" }}
              <p v-if="translation.tranOther" class="text-gray-400">
                {{ translation.tranOther }}
              </p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Example Sentences -->
      <div class="bg-gray-800 bg-opacity-75 p-6 rounded-md shadow-md">
        <h2 class="text-2xl font-semibold mb-4">Example Sentences</h2>
        <div
          v-if="targetWord.content.word.content.sentence?.sentences?.length"
          class="space-y-4"
        >
          <div
            v-for="(sentence, index) in targetWord.content.word.content.sentence
              .sentences"
            :key="index"
            class="p-3 bg-gray-700 rounded-md"
          >
            <p>{{ sentence.sContent || "No content available." }}</p>
            <p class="text-gray-400 text-sm">{{ sentence.sCn || "" }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500">No example sentences available.</p>
      </div>

      <!-- Synonyms -->
      <div
        v-if="targetWord.content.word.content.syno"
        class="bg-gray-800 bg-opacity-75 p-6 rounded-md shadow-md"
      >
        <h2 class="text-2xl font-semibold mb-4">Synonyms</h2>
        <ul class="list-disc pl-5 space-y-2 text-sm">
          <li
            v-for="(synonym, index) in targetWord.content.word.content.syno.synos || []"
            :key="index"
          >
            <span class="font-bold">{{ synonym.pos || "N/A" }}</span
            >: {{ synonym.tran }}
            <div class="flex flex-wrap gap-2 mt-1">
              <span
                v-for="word in synonym.hwds || []"
                :key="word.w"
                class="px-2 py-1 bg-indigo-800 text-indigo-300 rounded-md"
              >
                {{ word.w }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Phrases -->
      <div
        v-if="targetWord.content.word.content.phrase"
        class="bg-gray-800 bg-opacity-75 p-6 rounded-md shadow-md"
      >
        <h2 class="text-2xl font-semibold mb-4">Phrases</h2>
        <ul class="list-disc pl-5 space-y-2 text-sm">
          <li
            v-for="(phrase, index) in targetWord.content.word.content.phrase.phrases ||
            []"
            :key="index"
          >
            <span class="font-bold">{{ phrase.pContent || "N/A" }}</span>
            <p class="text-gray-400">{{ phrase.pCn || "" }}</p>
          </li>
        </ul>
      </div>

      <!-- Related Words -->
      <div
        v-if="targetWord.content.word.content.relWord"
        class="bg-gray-800 bg-opacity-75 p-6 rounded-md shadow-md"
      >
        <h2 class="text-2xl font-semibold mb-4">Related Words</h2>
        <ul class="list-disc pl-5 space-y-2 text-sm">
          <li
            v-for="(rel, index) in targetWord.content.word.content.relWord.rels || []"
            :key="index"
          >
            <span class="font-bold">{{ rel.pos || "N/A" }}</span
            >:
            <div class="flex flex-wrap gap-2 mt-1">
              <div
                v-for="(word, wordIndex) in rel.words || []"
                :key="wordIndex"
                class="px-2 py-1 bg-indigo-800 text-indigo-300 rounded-md"
              >
                {{ word.hwd || "N/A" }} -
                <span class="text-gray-400">{{ word.tran || "" }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- No Data Available -->
    <div v-else class="text-center text-gray-500">
      <p class="text-lg">No word data to display. Please select a word.</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  targetWord: {
    type: Object,
    default: null,
  },
});

const playVoice = (type) => {
  if (!props.targetWord || !props.targetWord.headWord) return;

  const audioUrl = `https://dict.youdao.com/dictvoice?audio=${
    props.targetWord.headWord
  }&type=${type === "uk" ? 1 : 2}`;
  const audio = new Audio(audioUrl);
  audio.play();
};
</script>

<style scoped>
/* Add shadow and spacing */
.bg-opacity-75 {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>

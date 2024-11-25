<template>
  <div class="flex justify-center my-10">
    <div class="w-11/12 lg:w-3/4">
      <h1 class="text-3xl font-bold text-center mb-8">完整国际音标学习表</h1>

      <!-- 元音部分 -->
      <section class="mb-10">
        <h2 class="text-2xl font-semibold mb-5 text-gray-300">元音</h2>

        <!-- 单元音 -->
        <div class="mb-5">
          <h3 class="text-xl font-medium mb-3 text-gray-400">单元音</h3>
          <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <div
              v-for="(phoneme, index) in vowels.simple"
              :key="'vowel-simple-' + index"
              class="phoneme-card bg-gray-800 text-gray-100"
              @click="playAudio(phoneme.audio)"
              :title="`点击播放 ${phoneme.symbol} 的发音`"
            >
              <span>{{ phoneme.symbol }}</span>
            </div>
          </div>
        </div>

        <!-- 双元音 -->
        <div>
          <h3 class="text-xl font-medium mb-3 text-gray-400">双元音</h3>
          <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <div
              v-for="(phoneme, index) in vowels.diphthongs"
              :key="'vowel-diphthong-' + index"
              class="phoneme-card bg-gray-800 text-gray-100"
              @click="playAudio(phoneme.audio)"
              :title="`点击播放 ${phoneme.symbol} 的发音`"
            >
              <span>{{ phoneme.symbol }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 辅音部分 -->
      <section>
        <h2 class="text-2xl font-semibold mb-5 text-gray-300">辅音</h2>
        <div class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
          <div
            v-for="(phoneme, index) in consonants"
            :key="'consonant-' + index"
            class="phoneme-card bg-gray-800 text-gray-100"
            @click="playAudio(phoneme.audio)"
            :title="`点击播放 ${phoneme.symbol} 的发音`"
          >
            <span>{{ phoneme.symbol }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 元音数据
const vowels = ref({
  simple: [
    { symbol: "/i:/", audio: "/phonetic/I-long.mp3" },
    { symbol: "/ɪ/", audio: "/phonetic/I.mp3" },
    { symbol: "/e/", audio: "/phonetic/e.mp3" },
    { symbol: "/æ/", audio: "/phonetic/æ.mp3" },
    { symbol: "/ɑː/", audio: "/phonetic/a-long.mp3" },
    { symbol: "/ɒ/", audio: "/phonetic/ɒ.mp3" },
    { symbol: "/ɔː/", audio: "/phonetic/ɔ-long.mp3" },
    { symbol: "/ʊ/", audio: "/phonetic/ʊ.mp3" },
    { symbol: "/u:/", audio: "/phonetic/u-long.mp3" },
    { symbol: "/ʌ/", audio: "/phonetic/ʌ.mp3" },
    { symbol: "/ɜː/", audio: "/phonetic/ə-long.mp3" },
    { symbol: "/ə/", audio: "/phonetic/ə.mp3" },
  ],
  diphthongs: [
    { symbol: "/eɪ/", audio: "/phonetic/eɪ.mp3" },
    { symbol: "/aɪ/", audio: "/phonetic/ai.mp3" },
    { symbol: "/ɔɪ/", audio: "/phonetic/ɔɪ.mp3" },
    { symbol: "/aʊ/", audio: "/phonetic/aʊ.mp3" },
    { symbol: "/əʊ/", audio: "/phonetic/əU.mp3" },
    { symbol: "/ɪə/", audio: "/phonetic/ɪə.mp3" },
    { symbol: "/eə/", audio: "/phonetic/eə.mp3" },
    { symbol: "/ʊə/", audio: "/phonetic/ʊə.mp3" },
  ],
});

// 辅音数据 (28个)
const consonants = ref([
  { symbol: "/p/", audio: "/phonetic/p_sound.mp3" },
  { symbol: "/b/", audio: "/phonetic/b_sound.mp3" },
  { symbol: "/t/", audio: "/phonetic/t_sound.mp3" },
  { symbol: "/d/", audio: "/phonetic/d_sound.mp3" },
  { symbol: "/k/", audio: "/phonetic/k_sound.mp3" },
  { symbol: "/ɡ/", audio: "/phonetic/g_sound.mp3" },
  { symbol: "/f/", audio: "/phonetic/f_sound.mp3" },
  { symbol: "/v/", audio: "/phonetic/v_sound.mp3" },
  { symbol: "/θ/", audio: "/phonetic/θ-unvoiced_th.mp3" },
  { symbol: "/ð/", audio: "/phonetic/ð-voiced_th.mp3" },
  { symbol: "/s/", audio: "/phonetic/s_sound.mp3" },
  { symbol: "/z/", audio: "/phonetic/z_sound.mp3" },
  { symbol: "/ʃ/", audio: "/phonetic/ʃ-sh_sound.mp3" },
  { symbol: "/ʒ/", audio: "/phonetic/ʒ-zh_sound.mp3" },
  { symbol: "/h/", audio: "/phonetic/h.mp3" },
  { symbol: "/tʃ/", audio: "/phonetic/tf.mp3" },
  { symbol: "/dʒ/", audio: "/phonetic/deg.mp3" },
  { symbol: "/m/", audio: "/phonetic/m.mp3" },
  { symbol: "/n/", audio: "/phonetic/n.mp3" },
  { symbol: "/ŋ/", audio: "/phonetic/nn.mp3" },
  { symbol: "/l/", audio: "/phonetic/l.mp3" },
  { symbol: "/r/", audio: "/phonetic/r.mp3" },
  { symbol: "/j/", audio: "/phonetic/j-yet-use.mp3" },
  { symbol: "/w/", audio: "/phonetic/w-wet-vet.mp3" },
  { symbol: "/ts/", audio: "/phonetic/ts.mp3" },
  { symbol: "/dz/", audio: "/phonetic/dz.mp3" },
  { symbol: "/tr/", audio: "/phonetic/tr.mp3" },
  { symbol: "/dr/", audio: "/phonetic/dr.mp3" },
]);

// 播放音频
const playAudio = (audioPath) => {
  const audio = new Audio(audioPath);
  audio.play();
};
</script>

<style scoped>
.phoneme-card {
  text-align: center;
  font-weight: bold;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.phoneme-card:hover {
  background-color: #4a5568; /* 更深的灰色 */
  transform: scale(1.1); /* 放大效果 */
}

body {
  background-color: #1a202c; /* 页面背景深色 */
  color: #edf2f7; /* 全局字体颜色为浅灰 */
}
</style>

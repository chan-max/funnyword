<template>
  <div
    class="flex flex-col items-center justify-center space-y-10 py-10 bg-transparent relative h-full"
  >
    <!-- 右上角下拉菜单 -->
    <div class="absolute top-4 right-4 flex space-x-4">
      <UDropdown :items="[keyboardOptions]" :popper="{ placement: 'bottom-start' }">
        <UButton
          color="white"
          :label="getLabelFromOptions(keyboardOptions, keyboardSound)"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />
        <template #item="{ item }">
          <div @click="keyboardSound = item.value" class="w-full text-left">
            {{ item.label }}
          </div>
        </template>
      </UDropdown>

      <UDropdown :items="[successOptions]" :popper="{ placement: 'bottom-start' }">
        <UButton
          color="white"
          :label="getLabelFromOptions(successOptions, successSound)"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />
        <template #item="{ item }">
          <div @click="successSound = item.value" class="w-full text-left">
            {{ item.label }}
          </div>
        </template>
      </UDropdown>

      <UDropdown :items="[errorOptions]" :popper="{ placement: 'bottom-start' }">
        <UButton
          color="white"
          :label="getLabelFromOptions(errorOptions, errorSound)"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />
        <template #item="{ item }">
          <div @click="errorSound = item.value" class="w-full text-left">
            {{ item.label }}
          </div>
        </template>
      </UDropdown>
    </div>

    <!-- 页面主内容 -->
    <div class="flex space-x-4">
      <!-- Display each character -->
      <span
        v-for="(char, index) in targetWord"
        :key="index"
        class="font-mono transition-all relative"
        :class="{
          'text-green-400 font-extrabold scale-110': index < currentIndex,
          'text-gray-500': index > currentIndex,
          'text-blue-400': index === currentIndex,
          shake: index === currentIndex && isShaking,
        }"
        style="font-size: 80px"
      >
        {{ char }}
        <!-- 下划线 -->
        <div
          v-if="index === currentIndex"
          class="absolute -bottom-2 left-0 w-full h-1 bg-blue-400"
        ></div>
      </span>
    </div>

    <div style="height: 120px">
      <div v-if="message" :class="messageClass" class="text-xl font-semibold mt-6">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLocalStorage } from "@vueuse/core";
import { ref, onUnmounted } from "vue";

const props = defineProps({
  targetWord: {
    default: "hello",
  },
}); // 单词

const emits = defineEmits(["error", "success", "init"]);

const currentIndex = ref(0); // 当前输入字符的索引
const message = ref("");
const messageClass = ref("");
const isShaking = ref(false); // 控制抖动效果
const isComplete = ref(false); // 是否已完成输入

// 默认音效文件
const keyboardSound = useLocalStorage("keyboard_sound", "/audio/click1.mp3");
const successSound = useLocalStorage("success_sound", "/audio/success1.mp3");
const errorSound = useLocalStorage("error_sound", "/audio/error1.mp3");

function getLabelFromOptions(options, value) {
  return options.find((item) => item.value == value).label;
}

// 音效选项
const keyboardOptions = ref([
  { label: "Click 1", value: "/audio/click1.mp3" },
  { label: "Click 2", value: "/audio/click2.mp3" },
  { label: "Click 3", value: "/audio/click3.mp3" },
]);

const successOptions = ref([
  { label: "Success 1", value: "/audio/success1.mp3" },
  { label: "Success 2", value: "/audio/success2.mp3" },
  { label: "Success 3", value: "/audio/success3.mp3" },
]);

const errorOptions = ref([
  { label: "Error 1", value: "/audio/error1.mp3" },
  { label: "Error 2", value: "/audio/error2.mp3" },
  { label: "Error 3", value: "/audio/error3.mp3" },
]);

// 设置音效函数
function setKeyboardSound(value) {
  keyboardSound.value = value;
}

function setSuccessSound(value) {
  successSound.value = value;
}

function setErrorSound(value) {
  errorSound.value = value;
}

// 播放音效函数
function playSound(src) {
  const audio = new Audio(src);
  audio.play();
}

// 检查是否为字母或数字
function isLetterOrDigit(key) {
  return /^[a-zA-Z0-9]$/.test(key);
}

// 键盘监听
function handleKeyDown(event) {
  // 检查是否按下 "Escape" 键以重置
  if (event.key === "Escape") {
    resetInput();
    return;
  }

  if (event.key === "Backspace") {
    if (currentIndex.value > 0) {
      currentIndex.value--;
      message.value = "已删除一个字符！";
      messageClass.value = "text-yellow-400";
      isComplete.value = false;
    } else {
      message.value = "没有更多字符可删除！";
      messageClass.value = "text-red-400";
    }
    return;
  }

  if (!isLetterOrDigit(event.key)) {
    return;
  }

  if (isComplete.value) {
    return;
  }

  const currentChar = props.targetWord[currentIndex.value];

  if (event.key === currentChar) {
    playSound(keyboardSound.value);
    currentIndex.value++;
    isShaking.value = false;

    if (currentIndex.value === props.targetWord.length) {
      message.value = "🎉 太棒了！你正确输入了单词！";
      messageClass.value = "text-green-400";
      playSound(successSound.value);
      isComplete.value = true;
      emits("success");
    }
  } else {
    isShaking.value = true;
    message.value = "❌ 输入错误，请重试！";
    messageClass.value = "text-red-400";
    playSound(errorSound.value);
    setTimeout(() => {
      isShaking.value = false;
    }, 500);
    emits("error");
  }
}

// 重置输入状态
function resetInput() {
  currentIndex.value = 0;
  message.value = "输入已重置！";
  messageClass.value = "text-blue-400";
  isShaking.value = false;
  isComplete.value = false;
}

watch(
  () => props.targetWord,
  () => {
    resetInput();
  }
);

window.addEventListener("keydown", handleKeyDown);

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>
<style scoped>
body {
  font-family: "Arial", sans-serif;
  background-color: transparent;
  color: #ffffff;
}

.scale-110 {
  transform: scale(1.1);
}

.transition-all {
  transition: all 0.3s ease-in-out;
}

.shake {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(10px);
  }
  75% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
  }
}

/* 单词成功动画 */
.animate-success {
  animation: success-animation 0.8s ease-in-out;
}

@keyframes success-animation {
  0% {
    transform: scale(1);
    color: #4caf50;
  }
  50% {
    transform: scale(1.5);
    color: #ffeb3b;
  }
  100% {
    transform: scale(1);
    color: #4caf50;
  }
}
</style>

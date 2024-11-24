<template>
  <div
    ref="containerRef"
    class="flex w-full flex-col items-center justify-center space-y-10 pt-16 bg-transparent relative"
  >
    <!-- 右上角下拉菜单 -->
    <div class="absolute top-4 left-2 flex space-x-4">
      <UPopover :popper="{ placement: 'top-start' }">
        <UButton
          color="white"
          label="设置"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />

        <template #panel>
          <div class="p-4 flex flex-col space-y-4 w-72">
            <!-- Keyboard Options -->

            <div class="flex items-center justify-between">
              <label
                class="text-right pr-4 text-sm font-medium text-gray-600 text-nowrap"
              >
                开始时播放读音
              </label>
              <UCheckbox v-model="typingConfig.playSoundAtBeginning" label="" />
            </div>


            <div class="flex items-center justify-between">
              <label
                class="text-right pr-4 text-sm font-medium text-gray-600 text-nowrap"
              >
                输入成功时播放读音
              </label>
              <UCheckbox v-model="typingConfig.playSoundAtTypeSuccess" label="" />
            </div>

            <div class="flex items-center justify-between">
              <label
                class="text-right pr-4 text-sm font-medium text-gray-600 text-nowrap"
              >
                输入成功时切换下一个
              </label>
              <UCheckbox v-model="typingConfig.autoSwitchToNextAfterSuccess" label="" />
            </div>
      
        

            <div class="flex items-center justify-between">
              <label
                class="text-right pr-4 text-sm font-medium text-gray-600 text-nowrap"
              >
                键盘音
              </label>
              <UDropdown
                :items="[keyboardOptions]"
                :popper="{ placement: 'bottom-start' }"
              >
                <UButton
                  color="white"
                  size="2xs"
                  :label="getLabelFromOptions(keyboardOptions, keyboardSound)"
                  trailing-icon="i-heroicons-chevron-down-20-solid"
                  class="flex-1"
                />
                <template #item="{ item }">
                  <div
                    @click="keyboardSound = item.value"
                    class="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    <span class="flex-1">{{ item.label }}</span>
                  </div>
                </template>
              </UDropdown>
            </div>

            <!-- Success Options -->
            <div class="flex items-center justify-between">
              <label
                class="text-right pr-4 text-sm font-medium text-gray-600 text-nowrap"
              >
                成功音
              </label>
              <UDropdown
                :items="[successOptions]"
                :popper="{ placement: 'bottom-start' }"
              >
                <UButton
                  color="white"
                  size="2xs"
                  :label="getLabelFromOptions(successOptions, successSound)"
                  trailing-icon="i-heroicons-chevron-down-20-solid"
                  class="flex-1"
                />
                <template #item="{ item }">
                  <div
                    @click="successSound = item.value"
                    class="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    <span class="flex-1">{{ item.label }}</span>
                  </div>
                </template>
              </UDropdown>
            </div>

            <!-- Error Options -->
            <div class="flex items-center justify-between">
              <label
                class="text-right pr-4 text-sm font-medium text-gray-600 text-nowrap"
              >
                错误音
              </label>
              <UDropdown :items="[errorOptions]" :popper="{ placement: 'bottom-start' }">
                <UButton
                size="2xs"
                  color="white"
                  :label="getLabelFromOptions(errorOptions, errorSound)"
                  trailing-icon="i-heroicons-chevron-down-20-solid"
                  class="flex-1"
                />
                <template #item="{ item }">
                  <div
                    @click="errorSound = item.value"
                    class="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                  >
                    <span class="flex-1">{{ item.label }}</span>
                  </div>
                </template>
              </UDropdown>
            </div>
          </div>
        </template>
      </UPopover>
    </div>

    <!-- 页面主内容 -->
    <div class="flex space-x-4 relative" :class="{ bounce: isBouncing }">
      <!-- Display each character -->
      <span
        v-for="(char, index) in targetWord"
        :key="index"
        class="font-mono transition-all relative"
        :class="{
          'text-green-400 font-extrabold scale-110': index < currentIndex,
          'text-gray-500': index > currentIndex,
          'text-custom-400': index === currentIndex,
          shake: index === currentIndex && isShaking,
        }"
        style="font-size: 80px; min-width: 24px"
      >
        {{ char }}

        <!-- 手指提示 -->
        <span
          v-if="index === currentIndex && currentFinger"
          class="absolute text-xs bg-gray-800 text-white rounded px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2 text-nowrap"
        >
          {{ currentFinger }}
        </span>

        <!-- 下划线 -->
        <div
          v-if="index === currentIndex"
          class="absolute -bottom-2 left-0 w-full h-1 bg-custom-400"
        ></div>
      </span>
    </div>

    <div style="height: 64px">
      <div v-if="message" :class="messageClass" class="text-xl font-semibold">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLocalStorage } from "@vueuse/core";
import { ref, watch, onMounted, onUnmounted } from "vue";
import { typingConfig } from "~/common/config";


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
const isTypingFocused = ref(true); // 页面是否处于激活状态

window.isTypingFocused = isTypingFocused;

const isBouncing = ref(false); // 跳动动画的控制

// 当前字母的手指提示
const currentFinger = ref("");

// 手指与按键的映射
const fingerMapping = {
  左小拇指: ["Q", "A", "Z", "1", "Tab", "CapsLock", "Shift"],
  左无名指: ["W", "S", "X", "2"],
  左中指: ["E", "D", "C", "3"],
  左食指: ["R", "T", "F", "G", "V", "B", "4", "5"],
  右食指: ["Y", "U", "H", "J", "N", "M", "6", "7"],
  右中指: ["I", "K", ",", "8"],
  右无名指: ["O", "L", ".", "9"],
  右小拇指: [
    "P",
    ";",
    "/",
    "[",
    "]",
    "'",
    "Enter",
    "Backspace",
    "Shift",
    "0",
    "-",
    "=",
    "\\",
  ],
};

// 获取字母需要用哪个手指输入
function getFingerForKey(key) {
  // 空格
  if (key == " ") {
    return "左大拇指";
  }

  for (const finger in fingerMapping) {
    if (fingerMapping[finger].includes(key.toUpperCase())) {
      return finger;
    }
  }
  return null;
}

// 在即将输入的字母发生变化时更新手指提示
watch(
  () => props.targetWord[currentIndex.value],
  (newChar) => {
    if (currentIndex.value < props.targetWord.length) {
      currentFinger.value = getFingerForKey(newChar);
    } else {
      currentFinger.value = null; // 清除提示
    }
  },
  { immediate: true }
);

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

// 播放音效函数
function playSound(src, startTime = 0) {
  const audio = new Audio(src);
  audio.currentTime = startTime;
  audio.play();
}

// 键盘监听
function handleKeyDown(event) {
  if (!isTypingFocused.value) return;

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

  if (isComplete.value) {
    return;
  }

  if (/^[a-zA-Z0-9 ]$/.test(event.key)) {
    if (event.key === props.targetWord[currentIndex.value]) {
      playSound(keyboardSound.value);
      currentIndex.value++;
      if (currentIndex.value === props.targetWord.length) {
        message.value = "🎉 太棒了！你正确输入了单词！";
        messageClass.value = "text-green-400";
        playSound(successSound.value);
        isComplete.value = true;
        isBouncing.value = true; // 启动跳动动画
        setTimeout(() => (isBouncing.value = false), 1000); // 结束动画

        emits("success");
      }
    } else {
      message.value = "❌ 输入错误，请重试！";
      messageClass.value = "text-red-400";
      isShaking.value = true;
      setTimeout(() => {
        isShaking.value = false;
      }, 300);
      playSound(errorSound.value);
    }
  }
}

// 重置输入状态
function resetInput() {
  currentIndex.value = 0;
  message.value = "输入已重置！";
  messageClass.value = "text-custom-400";
  isShaking.value = false;
  isComplete.value = false;
}

// 初始化和销毁事件监听
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});

// 监听单词变化时重置输入状态
watch(
  () => props.targetWord,
  () => {
    resetInput();
  }
);
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

.bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>

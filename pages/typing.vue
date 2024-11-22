<template>
  <div class="relative h-full">
    <!-- 上方文字打字效果 -->
    <WordTyper :targetWord="targetWord" @success="typeSuccess"></WordTyper>

    <!-- 左侧列表 -->
    <div
      class="absolute hide-scrollbar gradient-both"
      style="
        height: calc(80vh - var(--header-height));
        top: 10vh;
        left: 0;
        overflow: auto;
        padding: 50px;
      "
      ref="listContainer"
      @scroll="handleScroll"
    >
      <div
        class="text-white opacity-60 cursor-pointer hover:opacity-100 m-4 transition"
        :class="{ active: targetWord === item.word }"
        v-for="(item, index) in list"
        :key="item.word"
        ref="listItems"
        @click="wordClick(item, index)"
      >
        {{ item.word }}
      </div>
      <!-- 底部加载提示 -->
      <div v-if="loading" class="text-center text-white py-4">加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { getEnWordList } from "@/common/api/axios";
import { usePagination } from "@/common/paging";
import { ref, nextTick } from "vue";

const route = useRoute();

const targetWord = ref(); // 当前激活的单词
const targetWordLibIndex = ref(); // 当前激活的单词索引

const listContainer = ref(null); // 列表容器
const listItems = ref([]); // 列表项引用

// 使用分页钩子
const { list, getList, loading } = usePagination(getEnWordList, (params) => {
  params.pageSize = 100;
  return params;
});

// 滚动处理逻辑
const handleScroll = (event) => {
  const container = event.target;
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
    if (!loading.value) {
      getList();
    }
  }
};

// 处理点击事件
function wordClick(item, index) {
  targetWord.value = item.word;
  targetWordLibIndex.value = index;
  scrollToActive();
}

// 滚动到激活元素
function scrollToActive() {
  nextTick(() => {
    const activeElement = listItems.value[targetWordLibIndex.value];
    const container = listContainer.value;

    if (activeElement && container) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();

      // 判断激活元素是否超出可视范围
      if (
        activeRect.top < containerRect.top + 100 ||
        activeRect.bottom > containerRect.bottom - 100
      ) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}

// 初始化数据
async function init() {
  await getList();
  console.log("词库加载成功");

  targetWord.value = list.value[0]?.word;
  targetWordLibIndex.value = 0;
}

// 输入完成时，自动跳转到下一个单词
async function typeSuccess() {
  setTimeout(() => {
    if (targetWordLibIndex.value < list.value.length - 1) {
      targetWordLibIndex.value++;
      targetWord.value = list.value[targetWordLibIndex.value]?.word;
      scrollToActive();
    }
  }, 1000);
}

init();
</script>

<style>
.gradient-both {
  mask-image: linear-gradient(
    0deg,
    transparent 0%,
    /* 顶部完全透明 */ transparent 50px,
    /* 顶部透明延伸 */ rgba(0, 0, 0, 0.8) 100px,
    /* 顶部开始变得不透明 */ rgba(0, 0, 0, 1) calc(100% - 100px),
    /* 底部完全不透明 */ rgba(0, 0, 0, 0.8) calc(100% - 50px),
    /* 底部开始透明化 */ transparent 100% /* 底部完全透明 */
  );
}

.active {
  opacity: 1;
  font-weight: bold;
}
</style>

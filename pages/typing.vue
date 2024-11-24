<template>
  <div class="h-full w-full flex flex-col justify-center items-center">
    <!-- 上方文字打字效果 -->
    <WordTyper :targetWord="targetWord?.headWord" @success="typeSuccess"></WordTyper>
    <WordCard :targetWord="targetWord"></WordCard>
  </div>

  <!-- 左侧列表 -->
  <div
    class="fixed flex flex-col"
    style="height: calc(100vh - var(--header-height)); top: var(--header-height); left: 0"
  >
    <div class="p-8">总单词数量 : {{ total }}</div>
    <div
      ref="listContainer"
      @scroll="handleScroll"
      style="flex: 1; overflow: auto"
      class="gradient-both hide-scrollbar"
    >
      <div
        class="opacity-60 cursor-pointer hover:opacity-100 mx-10 my-4 transition"
        :class="{ active: targetWord?.headWord === item.headWord }"
        v-for="(item, index) in list"
        :key="item.headWord"
        ref="listItems"
        @click="wordClick(item, index)"
      >
        {{ item.headWord }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { getEnWordList } from "@/common/api/axios";
import { usePagination } from "@/common/paging";
import { ref, nextTick } from "vue";
import { getLocalWords } from "~/common/api/word";

const route = useRoute();

const targetWord = ref(); // 当前激活的单词
const targetWordLibIndex = ref(); // 当前激活的单词索引

const listContainer = ref(null); // 列表容器
const listItems = ref([]); // 列表项引用

// 使用分页钩子
const { list, getList, loading, getPreList, total } = usePagination(getLocalWords, {
  preprocessParams: (params) => {
    params.lib = route.query.lib;
    params.pageSize = 200;
    return params;
  },
  defaultCurrentPage: 1,
});

function getTopVisibleElement(container) {
  if (!container) return null;

  // 获取容器的所有子元素
  const elements = container.children;

  // 获取容器的可视区域
  const containerRect = container.getBoundingClientRect();

  // 遍历子元素，找出视图中最顶部的元素
  for (const element of elements) {
    const rect = element.getBoundingClientRect();

    // 检查元素是否完全或部分出现在容器的可视区域中
    if (rect.bottom > containerRect.top && rect.top < containerRect.bottom) {
      return element;
    }
  }

  return null; // 没有可见的元素
}

// 滚动处理逻辑
const handleScroll = async (event) => {
  console.log("handleScroll");

  const container = event.target;

  // 检查是否向上滚动触顶，触发获取上一页数据
  if (container.scrollTop <= 50 && !loading.value) {
    let currentViewTopEl = getTopVisibleElement(listContainer.value);

    await getPreList();

    nextTick(() => {
      currentViewTopEl.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    });
  }

  // 检查是否接近底部，触发获取下一页数据
  if (
    container.scrollTop + container.clientHeight >= container.scrollHeight - 50 &&
    !loading.value
  ) {
    getList();
  }
};

// 处理点击事件
function wordClick(item, index) {
  targetWord.value = item;
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

  targetWord.value = list.value[0];

  console.log(targetWord.value);

  targetWordLibIndex.value = 0;

  setTimeout(() => {
    const container = listContainer.value;
    if (container) {
      container.scrollTop = 10; // 向下滚动 10px
    }
  }, 33);
}

// 输入完成时，自动跳转到下一个单词
async function typeSuccess() {
  setTimeout(() => {
    if (targetWordLibIndex.value < list.value.length - 1) {
      targetWordLibIndex.value++;
      targetWord.value = list.value[targetWordLibIndex.value];
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

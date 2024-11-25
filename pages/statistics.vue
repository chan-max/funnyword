<template>
  <div class="min-h-screen text-white py-10 px-4">
    <div class="container mx-auto max-w-4xl">
      <!-- 页面标题 -->
      <h1 class="text-4xl font-bold text-center mb-10">统计数据</h1>

      <!-- 数量统计部分 -->
      <section class="mb-10">
        <h2 class="text-2xl font-semibold mb-5">数量统计</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-6 rounded-lg shadow-lg text-center bg-blue-500">
            <h3 class="text-lg font-medium">总字符数</h3>
            <p class="text-4xl font-bold my-2">{{ statistics.letterInputCount }}</p>
          </div>
          <div class="p-6 rounded-lg shadow-lg text-center bg-green-500">
            <h3 class="text-lg font-medium">正确字符数</h3>
            <p class="text-4xl font-bold my-2">
              {{ statistics.letterInputSuccessCount }}
            </p>
          </div>
          <div class="p-6 rounded-lg shadow-lg text-center bg-red-500">
            <h3 class="text-lg font-medium">错误字符数</h3>
            <p class="text-4xl font-bold my-2">{{ statistics.letterInputErrorCount }}</p>
          </div>
          <div class="p-6 rounded-lg shadow-lg text-center bg-purple-500">
            <h3 class="text-lg font-medium">成功单词数</h3>
            <p class="text-4xl font-bold my-2">{{ statistics.wordInputSuccessCount }}</p>
          </div>
        </div>
      </section>

      <!-- 时间统计部分 -->
      <section>
        <h2 class="text-2xl font-semibold mb-5">时间统计</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 最近耗时 -->
          <div class="p-6 rounded-lg shadow-lg text-center bg-gray-700">
            <h3 class="text-lg font-medium">最近耗时</h3>
            <p class="text-4xl font-bold my-2">
              {{ formatTime(statistics.latestWordInputCost) }}
            </p>
            <p class="text-sm text-gray-300">
              单词: {{ statistics.latestWordInputCostWord || "N/A" }}
            </p>
          </div>
          <!-- 最短耗时 -->
          <div class="p-6 rounded-lg shadow-lg text-center bg-green-600">
            <h3 class="text-lg font-medium">最短耗时</h3>
            <p class="text-4xl font-bold my-2">
              {{ formatTime(statistics.minimumWordInputCost) }}
            </p>
            <p class="text-sm text-gray-300">
              单词: {{ statistics.minimumWordInputCostWord || "N/A" }}
            </p>
          </div>
          <!-- 最长耗时 -->
          <div class="p-6 rounded-lg shadow-lg text-center bg-red-600">
            <h3 class="text-lg font-medium">最长耗时</h3>
            <p class="text-4xl font-bold my-2">
              {{ formatTime(statistics.maximumWordInputCost) }}
            </p>
            <p class="text-sm text-gray-300">
              单词: {{ statistics.maximumWordInputCostWord || "N/A" }}
            </p>
          </div>
        </div>
      </section>

      <div class="p-4 flex space-x-4">
        <div style="flex: 1"></div>

        <UButton color="orange" @click="resetWordRecords"> 清空单词标记 </UButton>
        <UButton color="red" @click="resetStatistics">清空记录</UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { statistics, resetStatistics, resetWordRecords } from "@/common/statistics"; // 替换为你的文件路径

// 格式化时间（毫秒转秒）
const formatTime = (ms) =>
  ms === Infinity || ms === 0 ? "N/A" : `${(ms / 1000).toFixed(2)} 秒`;
</script>

<style scoped>
/* 全局样式 */
body {
  font-family: Arial, sans-serif;
}
</style>

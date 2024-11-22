<template>
  <WordTyper :targetWord="route.params.word"></WordTyper>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

window.route = route
</script>

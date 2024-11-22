<template>
  <WordTyper :targetWord="route.query.w"></WordTyper>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
window.route = route;
window.router = router;
</script>

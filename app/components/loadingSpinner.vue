<script setup lang="ts">
defineProps<{
  color: string;
}>();
</script>
<template>
  <svg
    class="spinner"
    width="65px"
    height="65px"
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      class="path"
      fill="none"
      stroke-width="6"
      stroke-linecap="round"
      cx="33"
      cy="33"
      r="30"
      :stroke="color"
    ></circle>
  </svg>
</template>

<style scoped>
.spinner {
  --offset: 188;
  --duration: 1.4s;
  animation: rotator var(--duration) linear infinite;
}

@keyframes rotator {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(270deg);
  }
}

.path {
  stroke-dasharray: var(--offset);
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash var(--duration) ease-in-out infinite;
}

@keyframes dash {
  0% {
    stroke-dashoffset: var(--offset);
  }
  50% {
    stroke-dashoffset: 47; /* --offset / 4  calc() ne fonctionne pas avec stroke-dashoffset dans une animation @keyframes si tu utilises var() */
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: var(--offset);
    transform: rotate(450deg);
  }
}
</style>

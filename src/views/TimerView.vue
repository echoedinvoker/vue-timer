<template>
  <div class="flex-container timer">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="icon question-icon dark-outline" @click="router.push('/params')">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
    <main>
      <div :class="{pause: pause}" @click="pause = !pause">{{ formattedTimer }}</div>
    </main>
  </div>
</template>

<script setup>
import dedent from 'dedent';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const timer = ref(0)
const pause = ref(false)

const formattedTimer = computed(() => {
  const minute = Math.floor(timer.value / 60)
  const second = timer.value % 60
  return dedent`${minute ? minute + ':' : ''}\
    ${timer.value < 60 ? second : second.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })}`
})

const count = () => {
  setInterval(() => {
    if (!pause.value) {
      timer.value++
    }
  }, 1000)
}

count()


</script>

<style scoped>
* {
  background-color: #99e9f2;
  color: #495057;
}

.pause {
  text-shadow: 0 0 10px rgba(73, 80, 87, 0.4);
}

.dark-outline {
  stroke: #495057;
}
</style>

<template>
  <div class="flex-container">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="icon question-icon" @click="router.push('/params')">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
    <TransitionGroup tag="div" name="li" class="grid">
      <p class="timer test" :class="{ pause: pause }" @click="pause = !pause" @wheel="wheel">
        {{ formatedTimer }}
      </p>
      <button v-if="pause" class="btn accents">DONE</button>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import dedent from 'dedent';

const router = useRouter()

const timer = ref(0)
const pause = ref(false)


const formatedTimer = computed(() => {
  const minute = Math.floor(timer.value / 60)
  const second = timer.value % 60
  return dedent`
    ${minute ? minute + ':' : ''}\
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

const wheel = (e) => {
  if (e.deltaY < 0) {
    timer.value++
  } else {
    timer.value--
  }
}

const gotoParamsHandler = (e) => {
  if (e.key === "?") {
    router.push("/params")
  }
}

window.addEventListener('keypress', gotoParamsHandler)

onUnmounted('keypress', gotoParamsHandler)

</script>

<style scoped>
* {
  background-color: #99e9f2;
  color: #212529;
}

.start,
.pass {
  color: #212529;
  font-weight: 700;
  background-color: #99e9f2;
  padding: 10px;
  border: none;
  width: 70px;
  border-radius: 100px;
}

.pause {
  text-shadow: 0 0 10px rgba(33, 37, 41, 0.2);
}

.accents {
  background-color: #ffc1d6;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
}

p {
  background-color: rgba(0, 0, 0, 0);
}

.li-move {
  transition: transform 0.3s ease;
}
.li-leave-active,
.li-enter-active {
  transition: all 0.3s ease;
}
.li-leave-to,
.li-enter-from {
  opacity: 0;
  transform: translateY(50px);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  align-content: center;
  justify-content: center;
}

p {
  justify-self: center;
}

@keyframes fade-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }

  70% {
    opacity: 0.5;
    transform: scale(1.5);
  }

  100% {
    opacity: 0;
    transform: scale(2);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  30% {
    opacity: 0.5;
    transform: scale(0.5);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

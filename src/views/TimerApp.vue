<template>
  <div class="flex-container">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="question-icon" @click="gotoparams">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
    <div class="flex-container">
      <transition>
        <div class="timer" :class="{ pause: pause }" v-if="timer" @click="pause = !pause" @wheel="wheel">
          {{ formatedTimer }}
        </div>
      </transition>
      <transition name="start">
        <button class="start" v-if="!timer">START</button>
      </transition>
      <transition name="pass">
        <button class="pass" v-if="!timer">PASS</button>
      </transition>
    </div>
  </div>
</template>

<script setup>
import dedent from 'dedent';
import { ref } from 'vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const timer = ref(10)
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

const interval = setInterval(() => {
  if (timer.value) {
    if (!pause.value) {
      timer.value--
    }
  } else {
    clearInterval(interval)
  }
}, 1000)

const wheel = (e) => {
  if (e.deltaY < 0) {
    timer.value++
  } else {
    timer.value--
  }
}

const router = useRouter() 

const gotoparams = () => {
  router.push('/params')
}

window.addEventListener('keypress', (e) => {
  if (e.key === "?") {
    gotoparams()
  }
})

</script>

<style scoped>

.timer {
  font-size: 36px;
  font-weight: 700;
  transition: transform 1s ease-out;
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
  text-shadow: 0 0 10px rgba(153, 233, 242, 0.4);
}

.start:hover {
  box-shadow: 0 0 10px rgba(153, 233, 242, 0.4);
}

.start:active {
  box-shadow: 0 0 15px rgba(153, 233, 242, 0.4);
}

.question-icon {
  stroke: #adb5bd;
  width: 20px;
  position: absolute;
  top: 5px;
  left: 5px;
}

.v-enter-active {
  animation: fade-in 1s ease-in forwards;
  position: absolute;
}

.v-leave-active {
  animation: fade-out 1s ease-out forwards;
  position: absolute;
}

.start-enter-active {
  animation: left-in 1s ease-in forwards;
}

.start-leave-active {
  animation: left-in 1s ease-out forwards reverse;
}

.pass-enter-active {
  animation: right-in 1s ease-in forwards;
}

.pass-leave-active {
  animation: right-in 1s ease-out forwards reverse;
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

@keyframes left-in {
  0% {
    opacity: 0;
    transform: translateX(-120px);
  }

  30% {
    opacity: 0.5;
    transform: translateX(-60px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes right-in {
  0% {
    opacity: 0;
    transform: translateX(120px);
  }

  30% {
    opacity: 0.5;
    transform: translateX(60px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>

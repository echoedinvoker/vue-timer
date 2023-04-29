<template>
  <div class="flex-container">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="icon question-icon" @click="router.push('/lecture')">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
    <main class="flex-container">
      <transition>
        <div class="timer" :class="{ pause: pause }" v-if="!(!timer || (pause && starting))" @wheel="wheel">
          {{ formatedTimer }}
        </div>
      </transition>
      <transition name="start">
        <button class="btn" :class="{'btn-up': starting, 'btn-down': !starting}" v-if="!timer || (pause && starting)" @click="left">{{ starting ? btnText.up[0] : btnText.down[0] }}</button>
      </transition>
      <transition name="pass">
        <button class="btn" :class="{'btn-up': starting, 'btn-down': !starting}" v-if="!timer || (pause && starting)" @click="right">{{ starting ? btnText.up[1] : btnText.down[1] }}</button>
      </transition>
    </main>
  </div>
</template>

<script setup>

// Import Vue related package

import { useParamStore } from '@/stores/params';
import { onUnmounted, ref, defineEmits, reactive, defineProps } from 'vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

// Import other packages

import dedent from 'dedent';


// Normal variables

let intervalUp

// States

const router = useRouter()
const paramStore = useParamStore()

const timer = ref(paramStore.initSeconds)
const btnText = reactive({
  up: ['DONE', 'SKIP'],
  down: ['START', 'PASS']
})
const starting = ref(false)

// Computed

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

// Props definition

const props = defineProps(['pause'])

// Emits definition

const emits = defineEmits(['up', 'down', 'pause-release' ])


// Utilities functions

const countDown = () => {
  const interval= setInterval(() => {
    if (timer.value) {
      if (!props.pause) {
        timer.value--
      }
    } else {
      clearInterval(interval)
    }
  }, 1000)
}

const countUp = () => {
  const interval = setInterval(() => {
    if (!props.pause) {
      timer.value++
    }
  }, 1000)
  return interval
}



// Timer methods

const wheel = (e) => {
  if (e.deltaY < 0) {
    timer.value++
  } else {
    if(timer.value > 0) {
      timer.value--
    }
  }
}


// Button methods

const left = (ev) => {
  if(!starting.value) {
    ev.stopPropagation();
    starting.value = true
    intervalUp = countUp()
    emits('up')
  } else {
    ev.stopPropagation();
    starting.value = false
    clearInterval(intervalUp)
    timer.value = paramStore.initSeconds
    countDown()
    emits('down')
  }
}

const right = (ev) => {
  if(!starting.value) {
    ev.stopPropagation();
    timer.value = paramStore.initSeconds
    countDown()
    emits('pause-release')
  } else {
    ev.stopPropagation();
    starting.value = false
    clearInterval(intervalUp)
    timer.value = paramStore.initSeconds
    countDown()
    emits('down')
  }

}


const gotoParamsHandler = (e) => {
  if (e.key === "?") {
    router.push("/params")
  }
}

// Component lifecycle

onUnmounted('keypress', gotoParamsHandler)

// Window events

window.addEventListener('keypress', gotoParamsHandler)


// Run initially

countDown()

</script>

<style scoped>

.pause {
  text-shadow: 0 0 10px rgba(153, 233, 242, 0.4);
}

.btn {
  font-weight: 700;
  padding: 10px;
  border: none;
  width: 70px;
  border-radius: 100px;
  transition: all 1s ease;
}

.btn-down {
  color: #212529;
  background-color: #99e9f2;
}

.btn-up {
  color: #171A1E;
  background-color: #FF6B6B;
}


/* .:hover { */
/*   box-shadow: 0 0 10px rgba(153, 233, 242, 0.4); */
/* } */

/* .start:active { */
/*   box-shadow: 0 0 15px rgba(153, 233, 242, 0.4); */
/* } */


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

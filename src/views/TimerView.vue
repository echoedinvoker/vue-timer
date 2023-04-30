<template>
  <div class="flex">
    <transition>
      <div 
        class="timer" 
        :class="{
          'pause': timeStore.pause
        }"
          v-if="!((timeStore.direction === 'up' && timeStore.pause) || 
            (timeStore.direction === 'down' && !timeStore.time))" 
      >
        {{ formatedTimer }}
      </div>
    </transition>
      <transition name="left">
        <button 
          v-if="(timeStore.direction === 'up' && timeStore.pause) || 
            (timeStore.direction === 'down' && !timeStore.time)" 
          @click="timeStore.direction === 'down' ? start() : done()"
          class="btn" :class="{
              'btn-down': timeStore.direction === 'down',
              'btn-up': timeStore.direction === 'up',
            }">{{ timeStore.direction === 'down' ? 
              buttonText.down.left : 
              buttonText.up.left }}
        </button>
      </transition>
      <transition name="right">
      <div
          v-if="(timeStore.direction === 'up' && timeStore.pause) || 
            (timeStore.direction === 'down' && !timeStore.time)" 
      >
      <v-badge 
        :content="timeStore.passTimes" 
        :color="timeStore.direction === 'down' && timeStore.passTimes ? '' : 'rgba(0,0,0,0)'" 
        :dot="timeStore.direction === 'up' || !timeStore.passTimes">
        <button 
          @click="timeStore.direction === 'down' ? pass() : skip()"
          class="btn" :class="{
              'btn-down': timeStore.direction === 'down',
              'btn-up': timeStore.direction === 'up',
            }">{{ 
            timeStore.direction === 'down' ? 
              (timeStore.init ? buttonText.down.right.init : buttonText.down.right.after) :
              buttonText.up.right 
            }}
        </button>
      </v-badge>
        </div>
      </transition>
    </div>
</template>

<script setup>

import { computed } from 'vue';
import dedent from 'dedent';
import { useTimeStore } from '@/stores/time';
import { reactive } from 'vue';
import { onMounted } from 'vue';
import { onUnmounted } from 'vue';


const timeStore = useTimeStore()

const buttonText = reactive({
  up: { left: 'DONE', right: 'SKIP' },
  down: { left: 'START', right: { init: 'REST', after: 'PASS'} }
})

// Computed

const formatedTimer = computed(() => {
  const minute = Math.floor(timeStore.time / 60)
  const second = timeStore.time % 60
  return dedent`
    ${minute ? minute + ':' : ''}\
    ${timeStore.time < 60 ? second : second.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  })}`
})



const start = () => {
  timeStore.countUp()
  timeStore.pause = false
}

const done = () => {
  timeStore.time = timeStore.countDownInit
  timeStore.passTimes = 0
  timeStore.countDown()
  timeStore.pause = true
}

const pass = () => {
  timeStore.time = timeStore.countDownInit
  if (!timeStore.init) {
   timeStore.passTimes++
  }
  timeStore.init = false
  timeStore.countDown()
  timeStore.pause = false
}

const skip = () => {
  timeStore.time = timeStore.countDownInit
  timeStore.countDown()
  timeStore.pause = true
}

const togglePause = () => {
  timeStore.pause = !timeStore.pause
}

const wheeling = (ev) => {
  if (ev.deltaY < 0) timeStore.time++
  if (ev.deltaY > 0 && timeStore.time) timeStore.time--
}

onMounted(() => {
  document.addEventListener('mousedown', togglePause)
  document.addEventListener('wheel', wheeling)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', togglePause)
  document.removeEventListener('wheel', wheeling)
})

</script>

<style scoped>
.flex {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

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

.v-enter-active {
  animation: fade-in 1s ease-in forwards;
  position: absolute;
}

.v-leave-active {
  animation: fade-out 1s ease-out forwards;
  position: absolute;
}

.left-enter-active {
  animation: left-in 1s ease-in forwards;
}

.left-leave-active {
  animation: left-in 1s ease-out forwards reverse;
}

.right-enter-active {
  animation: right-in 1s ease-in forwards;
}

.right-leave-active {
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

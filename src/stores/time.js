import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimeStore = defineStore('time', () => {
  const countDownInit = ref(300)
  const time = ref(0)
  const startTime = ref(0)
  const endTime = ref(0)
  const passTimes = ref(0)
  const direction = ref('down')
  const pause = ref(false)
  const interval = ref(0)
  const init = ref(true)

  const countDown = () => {
    if (direction.value === 'down' && !time.value) return
    direction.value = 'down'
    clearInterval(interval.value)
    interval.value = setInterval(() => {
      if (time.value) {
        if (!pause.value) {
          time.value--
        }
      } else {
        clearInterval(interval.value)
      }
    }, 1000)
  }

  const countUp = () => {
    if (direction.value === 'up') return
    direction.value = 'up'
    clearInterval(interval.value)
    interval.value = setInterval(() => {
      if (!pause.value) {
        time.value++
      }
    }, 1000)
  }

  return { time, countDownInit, direction, pause, countUp, countDown, passTimes, init, startTime, endTime }
})

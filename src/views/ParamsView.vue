<template>
  <div class="flex-container" @click="navigateToTimer">
    <ul>
      <li>
        {{ `Init seconds: ${paramStore.initSeconds}` }}
      </li>
      <li>
        {{ `Key: ${formattedKeys}` }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useParamStore } from '@/stores/params';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const specialKeys = ['escape', 'tab', 'enter', 'backspace']

const router = useRouter()
const paramStore = useParamStore()

const keys = ref(new Set())
const recordedKeys = ref([])
const recordingKeys = ref(true)

const formattedKeys = computed(() => {
  return recordedKeys.value.map(key => {
    if (key === " ") {
      return "space"
    } else {
      return key
    }
  }).join(" + ").toUpperCase()
})

watch(keys.value, () => {
  if (keys.value.size === 0) {
    recordingKeys.value = true
  }
})

const navigateToTimer = () => {
  router.push('/timer')
}

window.addEventListener('keydown', (e) => {
  e.preventDefault()
  keys.value.add(e.key)
  if (recordingKeys.value && [...keys.value].some(k => /^[\w\s?]{1,1}$/.test(k) || specialKeys.includes(k.toLowerCase()))) {
    recordedKeys.value = [...keys.value]
    recordingKeys.value = false
  }
})
window.addEventListener('keyup', (e) => {
  e.preventDefault()
  keys.value.delete(e.key)
})
</script>

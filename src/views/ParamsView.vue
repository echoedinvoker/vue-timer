<template>
  <div class="flex-container">
    <ul>
      <li class="row">
        <label>
          Init seconds: 
        </label>
        <input class="input-init-seconds" :disabled="!editingInitSeconds" ref="editInitSecondsRef" 
          v-model="paramStore.initSeconds" />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="icon" @click="enterEditInitSeconds()" v-if="!editingInitSeconds">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>

      </li>
      <li class="row">
        {{ `Key: ${formattedKeys}` }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useParamStore } from '@/stores/params';
import { computed, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const specialKeys = ['escape', 'tab', 'enter', 'backspace']

const router = useRouter()
const paramStore = useParamStore()

const initSeconds = ref(paramStore.initSeconds)
const keys = ref(new Set())
const recordedKeys = ref([])
const recordingKeys = ref(true)

const editingInitSeconds = ref(false)

const editInitSecondsRef = ref(null)

const formattedKeys = computed(() => {
  return recordedKeys.value.map(key => {
    if (key === " ") {
      return "space"
    } else {
      return key
    }
  }).join(" + ").toUpperCase()
})

const enterEditInitSeconds = () => {
  editingInitSeconds.value = true
  setTimeout(() => {
    editInitSecondsRef.value.focus()
  }, 500)
}

watch(keys.value, () => {
  if (keys.value.size === 0) {
    recordingKeys.value = true
  }
})

const keydownHandler = (e) => {
  if (editingInitSeconds.value) {
    if (['escape', 'enter'].includes(e.key.toLowerCase())) {
      editingInitSeconds.value = false
      if (e.key.toLowerCase() === 'escape') {
        paramStore.initSeconds = initSeconds.value
      }
      if (e.key.toLowerCase() === 'enter') {
        initSeconds.value = paramStore.initSeconds
      }
      return
    }
    return
  }
  e.preventDefault()
  keys.value.add(e.key)
  if (recordingKeys.value && [...keys.value].some(k => /^[\w\s?]{1,1}$/.test(k) || specialKeys.includes(k.toLowerCase()))) {
    recordedKeys.value = [...keys.value]
    recordingKeys.value = false
  }
  if (e.key.toLowerCase() === 'escape') {
    router.push('/')
  }
}

const keyupHandler = (e) => {
  e.preventDefault()
  keys.value.delete(e.key)
}

window.addEventListener('keydown', keydownHandler)
window.addEventListener('keyup', keyupHandler)

onUnmounted(() => {
  window.removeEventListener('keydown', keydownHandler)
  window.removeEventListener('keyup', keyupHandler)
})

</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-init-seconds {
  width: 30px;
  font-size: 18px;
  font-family: 'inter', sans-serif;
  color: #adb5bd;
  border: none;
}

.input-init-seconds:focus {
  outline: none;
  /* caret-color: transparent; */
}

.hidden {
  display: none;
}
</style>

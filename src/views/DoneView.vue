<template>
  <div class="flex">
    <div>
      <form @submit.prevent="done">
        <div class="chips">
          <v-chip size="small" v-for="(t, i) in filtered" :key="i" @click="addTag(t)">{{ t }}</v-chip> 
          <v-chip size="small" v-for="(t, i) in tagsAdd" :key="i" @click="removeTag(t)" class="added">{{ t }}</v-chip>
        </div>
        <div class="row">
          <label for="tag">TAG</label>
          <input id="tag" type="text" v-model="tag" @input="autoc" @keydown="newTag">
        </div>
        <div class="row">
          <label for="git">GIT LINK</label>
          <textarea id="git" cols="30" rows="2" v-model="gitLink"></textarea>
        </div>
        <div class="row">
          <label for="summary">SUMMARY</label>
          <textarea id="summary" cols="30" rows="2" v-model="summary"></textarea>
        </div>
        <div class="row">
          <label for="description">DESCRIPTION</label>
          <textarea id="description" cols="30" rows="5" v-model="description"></textarea>
        </div>
        <div class="btn-container">
          <v-btn size="small" type="submit">DONE</v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useTimeStore } from '@/stores/time';
import axios from 'axios';
import { onUnmounted } from 'vue';
import { inject } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const timeStore = useTimeStore()
const router = useRouter()

const tagsAdd = ref([])
const summary = ref('')
const description = ref('')
const gitLink = ref('')
const tag = ref('')
const filtered = ref([])

const tags = ['summary', 'description']

const autoc = () => {
  filtered.value = []
  filtered.value = tags.filter(t => t.toLowerCase().startsWith(tag.value.toLowerCase()));
  if (!tag.value.trim()) filtered.value = []
}
const addTag = (t) => {
  if (!tagsAdd.value.includes(t)) tagsAdd.value.push(t)
  tag.value = ''
  filtered.value = []
}
const removeTag = (t) => {
  tagsAdd.value = tagsAdd.value.filter(el => el !== t)
}
const newTag = (ev) => {
  if (ev.key !== 'Enter') return
  if (!tagsAdd.value.includes(tag.value) && tag.value.trim()) tagsAdd.value.push(tag.value)
  tag.value = ''
  filtered.value = []
}
const done = () => {
  timeStore.time = timeStore.countDownInit
  timeStore.countDown()
  timeStore.init = false
  timeStore.passTimes = 0 
  timeStore.pause = true
  router.push('/timer')
}

const switchPages = inject('switchPages')

onMounted(async () => {
  await axios.get('bash/corner-form')
  document.removeEventListener('keydown', switchPages)
})

onUnmounted(() => {
  document.addEventListener('keydown', switchPages)
})
</script>

<style scoped>
.added {
  background-color: #99e9f2;
  color: #212529;
}
.chips {
  width: 100%;
  display: flex;
  justify-content: center;
}
.v-chip {
  margin-right: 5px;
  /* grid-template-columns: 1fr 1fr 1fr 1fr 1fr; */
  /* align-items: start; */
  /* gap: 5px; */
}
label {
  font-size: 10px;
  display: inline-block;
  width: 100px;
}

li {
  font-size: 8px;
}

.row {
  display: flex;
  justify-content: start;
  margin-top: 10px;
}

.flex {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: start;
  padding-top: 50px;
}

.grid {
  width: 50%;
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 10px;
}

.btn-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

</style>

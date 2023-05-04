<template>
  <div class="flex">
    <div>
      <form @submit.prevent="done">
        <div class="chips">
          <button class="chip" type="button" v-for="(t, i) in filtered" :key="i" @click.prevent="addTag(t)">{{ t }}</button> 
          <button class="chip added" type="button" v-for="(t, i) in data.tags" :key="i" @click.prevent="removeTag(t)">{{ t }}</button>
        </div>
        <div class="row">
          <label for="tag">TAG</label>
          <input id="tag" type="text" v-model="tag" @input="autoc">
          <button class="add" type="button" @click="addTag(tag)">add</button>
        </div>
        <div class="row">
          <label for="git">UDEMY LINK</label>
          <textarea id="git" cols="30" rows="2" v-model="data.udemyLink"></textarea>
        </div>
        <div class="row">
          <label for="summary">SUMMARY</label>
          <textarea id="summary" cols="30" rows="2" v-model="data.summary"></textarea>
        </div>
        <div class="row">
          <label for="description">DESCRIPTION</label>
          <textarea id="description" cols="30" rows="5" v-model="data.description"></textarea>
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
import { reactive } from 'vue';
import { inject } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const timeStore = useTimeStore()
const router = useRouter()

const data = reactive({
  tags: [],
  summary: '',
  description: '',
  linkUdemy: '',
  target: false,
  status: 'done'
})

const tag = ref('')
const filtered = ref([])

const tags = ['summary', 'description']

const autoc = () => {
  filtered.value = []
  filtered.value = tags.filter(t => t.toLowerCase().startsWith(tag.value.toLowerCase()));
  if (!tag.value.trim()) filtered.value = []
}

const addTag = (t) => {
  if (!data.tags.includes(t) && t.trim()) data.tags.unshift(t)
  tag.value = ''
  filtered.value = []
}

const removeTag = (t) => {
  data.tags = data.tags.filter(el => el !== t)
}

const done = async () => {
  const { data: { data: { lectures: le }} } = await axios.get(`lecture?target=true`)
  const payload = JSON.parse(JSON.stringify(data))
  if (!payload.linkUdemy) {
    delete payload.linkUdemy
  }
  await axios.patch(`lecture/${le[0]._id}`, payload)
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
.chip {
  border-radius: 100px;
  padding: 3px 10px;
  border-style: none;
  font-weight: 600;
  color: #495057;
}
.chip:hover {
  cursor: pointer;
}
.added, 
.added:active {
  background-color: #99e9f2;
  color: #212529;
}
.added:hover {
  background-color: #99e9f2;
  box-shadow: 0 0 10px rgba(153, 233, 242, 0.4);
  color: #212529;
}

.add {
  margin-left: 10px;
  border-style: none;
  border-radius: 10px;
  padding: 3px 10px;
}

.chips {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 3px;
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

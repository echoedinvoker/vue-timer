import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import TimerView from './views/TimerView.vue'
import LectureView from './views/LectureView.vue'
import axios from 'axios';
import VueAxios from 'vue-axios'

const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/timer'},
    { path: '/timer', component: TimerView},
    { path: '/lecture', component: LectureView},
  ]
})


const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(VueAxios, axios)

app.provide('axios', app.config.globalProperties.axios)

app.mount('#app')

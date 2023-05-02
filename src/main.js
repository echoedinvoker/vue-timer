import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import TimerView from './views/TimerView.vue'
import LectureView from './views/LectureView.vue'
import DoneView from './views/DoneView.vue'
import axios from 'axios';
import VueAxios from 'vue-axios'
import { createVuetify } from 'vuetify/lib/framework.mjs'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


axios.defaults.baseURL = 'http://localhost:4000/api/v1/'

const pinia = createPinia()
const vuetify = createVuetify({
  components,
  directives
})
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/timer'},
    { path: '/timer', component: TimerView},
    { path: '/lecture', component: LectureView},
    { path: '/done', component: DoneView},
  ]
})


const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.use(router)
app.use(VueAxios, axios)

app.provide('axios', app.config.globalProperties.axios)

app.mount('#app')

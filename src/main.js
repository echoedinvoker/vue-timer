import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import CountDown from './views/CountDown.vue'
import TimerView from './views/TimerView.vue'
import ParamsView from './views/ParamsView.vue'
import axios from 'axios';
import VueAxios from 'vue-axios'

const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/countdown'},
    { path: '/countdown', component: CountDown},
    { path: '/timer', component: TimerView},
    { path: '/params', component: ParamsView},
  ]
})


const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(VueAxios, axios)

app.provide('axios', app.config.globalProperties.axios)

app.mount('#app')

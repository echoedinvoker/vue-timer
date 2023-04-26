import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import TimerView from './views/TimerView.vue'
import ParamsView from './views/ParamsView.vue'
import { createPinia } from 'pinia'


const pinia = createPinia()
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/timer'},
    { path: '/timer', component: TimerView},
    { path: '/params', component: ParamsView},
  ]
})


const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')

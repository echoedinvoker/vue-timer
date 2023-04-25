import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import TimerApp from './views/TimerApp.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/timer', component: TimerApp}
  ]
})

const app = createApp(App)
app.use(router)

app.mount('#app')

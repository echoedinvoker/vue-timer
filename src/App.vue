<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" class="root" :class="{
        'count-down': timeStore.direction === 'down',
        'count-up': timeStore.direction === 'up',
      }">

    </component>
  </router-view>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useTimeStore } from './stores/time';
import { provide } from 'vue';
import { useLectureStore } from './stores/lecture';

const route = useRoute()
const router = useRouter()
const timeStore = useTimeStore()
const lectureStore = useLectureStore()

const switchPages = (e) => {
  if (e.key === " ") {
    if (route.path.includes('lecture')) {
      router.push("/")
    } else {
      router.push("/lecture")
    }
  }
}

provide('switchPages', switchPages)
lectureStore.fetchAllLectures()
document.addEventListener('keydown', switchPages)

</script>


<style>
/*
SPACING SYSTEM (px)
2 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128
FONT SIZE SYSTEM (px)
10 / 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 44 / 52 / 62 / 74 / 86 / 98
*/

/*
COLORS
MAIN(backgound): #212529 #495057 #adb5bd(lighter)
SUB(button): #99e9f2
*/

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ------------------------ */
/* GENERAL STYLES */
/* ------------------------ */
.root {
  font-size: 18px;
  font-family: 'inter', sans-serif;
}

.count-up {
  color: #212529;
  background-color: #99e9f2;
}

.count-down {
  color: #adb5bd;
  background-color: #212529;
}

ul,
ol {
  list-style: none;
}


.timer {
  font-size: 36px;
  font-weight: 700;
  transition: transform 1s ease-out;
}

.icon {
  stroke: #adb5bd;
  width: 20px;
}

.question-icon {
  position: absolute;
  top: 5px;
  left: 5px;
}

.flex-container {
  display: flex;
  gap: 8px;
  padding: 12px;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
</style>

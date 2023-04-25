<template>
  <router-view v-slot="{ Component }">
    <transition mode="default" name="page-slice">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<style>
/*
SPACING SYSTEM (px)
2 / 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96 / 128
FONT SIZE SYSTEM (px)
10 / 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 / 44 / 52 / 62 / 74 / 86 / 98
*/

/*
COLORS
MAIN(backgound): #212529 #adb5bd(lighter)
SUB(button): #99e9f2
*/

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #212529;
}

/* ------------------------ */
/* GENERAL STYLES */
/* ------------------------ */
body {
  font-family: 'inter', sans-serif;
  color: #adb5bd;
}

ul,ol {
  list-style: none;
}

.page-slice-enter-active,
.page-slice-leave-active {
  position: absolute;
  transition: 1s ease all;
}

.page-slice-enter-from,
.page-slice-leave-to {
  opacity: 0;
  transform: translateY(200px);
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

import { defineStore } from "pinia";
import { ref } from "vue";

export const useParamStore = defineStore('params', () => {
  const initSeconds = ref(120)

  return { initSeconds }
})

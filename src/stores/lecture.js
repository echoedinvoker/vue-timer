import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useLectureStore = defineStore('lecture', () => {
  const lectures = ref([])

  const subjects = computed(() => {
    const subjects = new Set()
    lectures.value.forEach(l => {
      subjects.add(l.subject)
    })
    return [...subjects]
  })

  const tags = computed(() => {
    const tags = {}
    subjects.value.forEach(s => {
      tags[s] = new Set
    })
    lectures.value.forEach(l => {
      l.tags.forEach(t => {
        tags[l.subject].add(t)
      })
    })
    return tags
  })

  const target = computed(() => {
    return lectures.value.find(l => l.target)
  })

  const fetchAllLectures = async () => {
    const { data: { data: { lectures: lecData } } } = await axios.get('lecture')
    lectures.value = lecData
  }

  return { lectures, subjects, tags, target, fetchAllLectures }
})

<template>
  <div class="container">
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>Chapter</th>
          <th>Lecture</th>
          <th>Total Length</th>
          <th>Complete</th>
          <th>Complete Today</th>
          <th>Length</th>
          <th>Target</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(lec, i) in firstPerSub" :key="i">
          <td>{{ lec.subject }}</td>
          <td>{{ lec.chapter }}</td>
          <td>{{ lec.lecture }}</td>
          <td>{{ formatTime(lec.totalLength) }}</td>
          <td>{{ `${lec.completeLength}(${(lec.completeLength * 100 / lec.totalLength).toFixed(1)}%)` }}</td>
          <td>{{ `${lec.completeToday}(${(lec.completeToday * 100 / lec.totalLength).toFixed(1)}%)` }}</td>
          <td>{{ `${formatTime(lec.length)}(${(lec.length * 100 / lec.totalLength).toFixed(1)}%)` }}</td>
          <td @click="changeTarget(lec.subject)">{{ lec.targeted }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import axios from 'axios';
import { computed } from 'vue';
import { onMounted } from 'vue';
import moment from 'moment-timezone';
import { reactive } from 'vue';
import { watch } from 'vue';


const lectures = reactive([])

const now = moment.tz('Asia/Taipei')

const lecturesToday = lectures.filter((lec) => {
  if (lec.status === 'done') {
    const lecDate = moment(lec.timeEnd)
    return now.isSame(lecDate, 'day')
  }
  return false
})

watch(
  lectures,
  () => {
    console.log('test')
    targetedSubject = lectures.filter((lec) => lec.target)[0]?.subject
  }
)

const firstPerSub = computed(() => {
  const sublist = []
  return lectures
    .filter((lec) => {
      if (!sublist.includes(lec.subject) && lec.status === 'new') {
        sublist.push(lec.subject)
        return true
      }
      return false
    })
    .map((lec) => {
      const totalLength = lectures.reduce((a, l) => {
        if (l.subject === lec.subject) {
          return a + l.length
        }
        return a
      }, 0)
      const completeLength = lectures.reduce((a, l) => {
        if (l.subject === lec.subject && l.status === 'done') {
          return a + l.length
        }
        return a
      }, 0)
      return Object.assign(lec, { totalLength, completeLength })
    })
    .map((lec) => {
      const lecturesTodayOfSubject = lecturesToday.filter((l) => l.subject === lec.subject)
      if (lecturesTodayOfSubject.length) {
        const completeLengthTodayOfSubject = lecturesTodayOfSubject.reduce((a, l) => {
          return a + l.length
        }, 0)
        return Object.assign(lec, { completeToday: completeLengthTodayOfSubject })
      }
      return Object.assign(lec, { completeToday: 0 })
    })
    .map((lec) => {
      if (targetedSubject && lec.subject === targetedSubject) {
        return Object.assign(lec, { targeted: true })
      }
      return Object.assign(lec, { targeted: false })
    })
})

const formatTime = (mins) => {
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
}

const changeTarget = async (subject) => {
  const index = lectures.findIndex(lec => lec.targeted)
  lectures[index].targeted = false
  for (const lec of lectures) {
    if (lec.subject === subject) {
      const ind = lectures.findIndex(l => lec._id === l._id)
      lectures[ind].targeted = true
      break
    }
  }
  const response = await axios.get(`lecture/target-subject/${subject}`)
  console.log(response.ok)
}


let targetedSubject

onMounted(async () => {
  const { data: { data: { lectures: lecData } } } = await axios.get('lecture')
  lectures.splice(0, lectures.length, ...lecData)


  targetedSubject = lectures.filter((lec) => lec.target)[0]?.subject
})
</script>

<style scoped>
.container {
  height: 100vh;
}

table {
  font-size: 80%;
  width: 100%;
  padding: 50px;
}

th {
  text-align: left;
}
</style>

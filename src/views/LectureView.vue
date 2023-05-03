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
          <!-- <td">{{ lec.targeted }}</td> -->
          <td>
            <svg @click="lec.target || changeTarget(lec.subject)" v-if="lec.target" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="targeted-icon">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg @click="lec.target || changeTarget(lec.subject)" v-else xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="targeted-icon">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

          </td>
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
    targetedSubject = lectures.filter((lec) => lec.target)[0]?.subject
  }
)

const firstPerSub = computed(() => {
  const sublist = []
  const filteredLectures = lectures
    .filter((lec) => {
      if (!sublist.includes(lec.subject) && lec.status === 'new') {
        sublist.push(lec.subject)
        return true
      }
      return false
    })
  console.log(sublist)
  return filteredLectures
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
        return Object.assign(lec, { target: true })
      }
      return Object.assign(lec, { target: false })
    })
})

const formatTime = (mins) => {
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
}

const changeTarget = async (subject) => {
  const flags = [false, false]
  try {
    const { status } = await axios.get(`lecture/target-subject/${subject}`)
    if (status !== 200) throw new Error('something go wrong...')
    for (const [i, lec] of lectures.entries()) {
      if (lec.target && lec.subject !== subject) {
        lectures[i].target = false
        flags[0] = true
        if (flags[0] && flags[1]) break
        continue
      }
      if (lec.subject === subject && !lec.target) {
        lectures[i].target = true
        flags[1] = true
        if (flags[0] && flags[1]) break
        continue
      }
    }

  } catch (error) {
    console.log(error.message)
  }
}


let targetedSubject

onMounted(async () => {
  await axios.get('bash/fullscreen')
  const { data: { data: { lectures: lecData } } } = await axios.get('lecture')
  console.log(lecData)
  lectures.splice(0, lectures.length, ...lecData)

  targetedSubject = lectures.filter((lec) => lec.target)[0]?.subject
})
</script>

<style scoped>
.targeted-icon {
  width: 20px;
  margin-left: 10px;
}

.container {
  width: 100%;
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

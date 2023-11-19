<template>
  <div class="container">
    <!-- <table> -->
    <!--   <thead> -->
    <!--     <tr> -->
    <!--       <th>Subject</th> -->
    <!--       <th>Chapter</th> -->
    <!--       <th>Lecture</th> -->
    <!--       <th>Total Length</th> -->
    <!--       <th>Complete</th> -->
    <!--       <th>Complete Today</th> -->
    <!--       <th>Length</th> -->
    <!--       <th>Target</th> -->
    <!--     </tr> -->
    <!--   </thead> -->
    <!--   <tbody> -->
    <!--     <tr v-for="(lec, i) in firstPerSub" :key="i"> -->
    <!--       <td>{{ lec.subject }}</td> -->
    <!--       <td>{{ lec.chapter }}</td> -->
    <!--       <td>{{ lec.lecture }}</td> -->
    <!--       <td>{{ formatTime(lec.totalLength) }}</td> -->
    <!--       <td>{{ `${lec.completeLength}(${(lec.completeLength * 100 / lec.totalLength).toFixed(1)}%)` }}</td> -->
    <!--       <td>{{ `${lec.completeToday}(${(lec.completeToday * 100 / lec.totalLength).toFixed(1)}%)` }}</td> -->
    <!--       <td>{{ `${formatTime(lec.length)}(${(lec.length * 100 / lec.totalLength).toFixed(1)}%)` }}</td> -->
    <!--       <td> -->
    <!--         <svg @click="lec.target || changeTarget(lec.subject)" v-if="lec.target" xmlns="http://www.w3.org/2000/svg" -->
    <!--           fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="targeted-icon"> -->
    <!--           <path stroke-linecap="round" stroke-linejoin="round" -->
    <!--             d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> -->
    <!--         </svg> -->
    <!--         <svg @click="lec.target || changeTarget(lec.subject)" v-else xmlns="http://www.w3.org/2000/svg" fill="none" -->
    <!--           viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="targeted-icon"> -->
    <!--           <path stroke-linecap="round" stroke-linejoin="round" -->
    <!--             d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> -->
    <!--         </svg> -->
    <!---->
    <!--       </td> -->
    <!--     </tr> -->
    <!--   </tbody> -->
    <!-- </table> -->
    <v-data-table theme="dark" v-model:items-per-page="itemsPerPage" :headers="headers" :items="firstPerSub"
      item-value="name" class='table'>
      <template v-slot:[`item.target`]="{ item }">
        <v-switch :model-value="item.value.target" @click="changeTarget(item.value.subject)"></v-switch>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import axios from 'axios';
import { computed } from 'vue';
import { onMounted } from 'vue';
import moment from 'moment-timezone';
import { reactive } from 'vue';
import { watch } from 'vue';
import { ref } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable';

const itemsPerPage = ref(10)
const headers = ref([
  { title: 'Subject', align: 'start', sortable: false, key: 'subject' },
  { title: 'Chapter', align: 'start', sortable: false, key: 'chapter' },
  { title: 'Lecture', align: 'start', sortable: false, key: 'lecture' },
  { title: 'Total Length', align: 'start', sortable: true, key: 'totalLength' },
  { title: 'Complete', align: 'start', sortable: true, key: 'completeLength' },
  { title: 'Complete Tody', align: 'start', sortable: true, key: 'completeToday' },
  { title: 'Length', align: 'start', sortable: true, key: 'length' },
  { title: 'Target', align: 'start', sortable: false, key: 'target' },
])


const lectures = reactive([])

const now = moment.tz('Asia/Taipei')

const lecturesToday = computed(() => {
  return lectures.filter((lec) => {
    if (lec.status === 'done' && lec.timeEnd) {
      const lecDate = moment(lec.timeEnd)
      return now.isSame(lecDate, 'day')
    }
    return false
  })

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
  return filteredLectures
    .map((lec) => {
      const rawTotalLength = lectures.reduce((a, l) => {
        if (l.subject === lec.subject) {
          return a + l.length
        }
        return a
      }, 0)
      const totalLength = formatTime(rawTotalLength)
      let completeLength = lectures.reduce((a, l) => {
        if (l.subject === lec.subject && l.status === 'done') {
          return a + l.length
        }
        return a
      }, 0)
      completeLength = `${formatTime(completeLength)} (${(completeLength * 100 / rawTotalLength).toFixed(1)}%)`
      return Object.assign(lec, { totalLength, completeLength })
    })
    .map((lec) => {
      const rawTotalLength = lectures.reduce((a, l) => {
        if (l.subject === lec.subject) {
          return a + l.length
        }
        return a
      }, 0)
      const lecturesTodayOfSubject = lecturesToday.value.filter((l) => l.subject === lec.subject)
      if (lecturesTodayOfSubject.length) {
        const completeLengthTodayOfSubject = lecturesTodayOfSubject.reduce((a, l) => {
          return a + l.length
        }, 0)
        return Object.assign(lec, { completeToday: `${formatTime(completeLengthTodayOfSubject)} (${(completeLengthTodayOfSubject * 100 / rawTotalLength).toFixed(1)}%)` })
      }
      return Object.assign(lec, { completeToday: `00:00 (0%)` })
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
  const newLectures = lectures.map(l => {
    if (l.subject === subject) {
      return {
        ...l,
        target: true
      }
    } else {
      return {
        ...l,
        target: false
      }
    }
  })

  lectures.splice(0, lectures.length, ...newLectures)

  try {
    await axios.get(`lecture/target-subject/${subject}`)
  } catch (error) {
    console.log(error.message)
  }
}


let targetedSubject

onMounted(async () => {
  await axios.get('bash/fullscreen')
  const { data: { data: { lectures: lecData } } } = await axios.get('lecture')
  lectures.splice(0, lectures.length, ...lecData)

  targetedSubject = lectures.filter((lec) => lec.target)[0]?.subject



  // test counting how many days to finish all course

  const data = lectures.filter(l => l.status === 'done' && l.timeEnd)

  const timeZone = 'Asia/Taipei';

  const groupedData = data.reduce((acc, curr) => {
    // Extract the date from the 'timeEnd' property using the 'Asia/Taiwan' timezone
    const date = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(curr.timeEnd));

    // If the date is not yet in the accumulator, add it with the initial 'length' value
    if (!acc[date]) {
      acc[date] = curr.length;
    } else {
      // If the date is already in the accumulator, add the 'length' value to the existing sum
      acc[date] += curr.length;
    }

    return acc;
  }, {});

  console.log(groupedData);

  let totalSum = 0;
  let numOfDays = 0;

  for (const key in groupedData) {
    totalSum += groupedData[key];
    numOfDays++;
  }

  const averageValuePerDay = totalSum / numOfDays;
  console.log(averageValuePerDay);

  const leftTime = lectures.reduce((acc, l) => {
    if (l.status === 'new') {
      return acc + l.length
    }
    return acc
  }, 0)

  console.log(Math.ceil(leftTime / averageValuePerDay))
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

.table {
  font-size: 70%;
  height: 100vh;
  padding: 0 50px;
}

.chosen {
  color: red;
}
</style>

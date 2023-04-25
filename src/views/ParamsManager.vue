<template>
  <div class="flex-container" @click="navigateToTimer">
      PARAMETERS
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const navigateToTimer = () => {
  router.push('/timer')
}
</script>

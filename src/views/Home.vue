<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.push('/login')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="animate-pulse flex flex-col items-center">
      <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-text/60">Loading E-Admin Sekolah...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Send, Phone, History, CheckCircle2 } from 'lucide-vue-next'

const broadcasts = ref<any[]>([])
const isLoading = ref(false)
const message = ref('')
const recipient = ref('')

const gatewayConfig = ref({
  provider: 'Fonnte',
  apiKey: 'FN-APIKEY-DEMO-99182',
  status: 'Connected'
})

const fetchBroadcasts = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('/api/wa/broadcasts')
    broadcasts.value = res.data
  } catch (error) {
    console.error('Failed to load broadcasts:', error)
  } finally {
    isLoading.value = false
  }
}

const sendBroadcast = async () => {
  if (!message.value || !recipient.value) return
  
  try {
    await axios.post('/api/wa/broadcasts', {
      message: message.value,
      recipient: recipient.value
    })
    message.value = ''
    recipient.value = ''
    fetchBroadcasts()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchBroadcasts()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5">
      <div>
        <h1 class="text-3xl font-extrabold text-text flex items-center tracking-tight">
          <Phone class="w-8 h-8 mr-3 text-primary" />
          WhatsApp Center & Gateway
        </h1>
        <p class="text-text/60 text-sm mt-1">Konfigurasi Fonnte / Wablas API Gateway untuk pengiriman otomatis raport, nilai, absensi harian, dan broadcast pengumuman.</p>
      </div>
    </div>

    <!-- Configuration & Status -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card-modern p-5 bg-gradient-to-br from-blue-900 to-blue-800 text-white md:col-span-2">
        <h3 class="font-bold text-base flex items-center text-yellow-400">
          <CheckCircle2 class="w-5 h-5 mr-2 text-yellow-400" /> Gateway Integration Status
        </h3>
        <p class="text-xs text-white/80 mt-2">API Provider: <span class="font-bold text-white">{{ gatewayConfig.provider }}</span></p>
        <p class="text-xs text-white/80 mt-1">API Key Status: <span class="font-mono bg-white/10 px-2 py-0.5 rounded text-[10px]">{{ gatewayConfig.apiKey }}</span></p>
        <div class="mt-4 flex items-center space-x-2">
          <span class="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></span>
          <span class="text-xs font-bold">Terhubung & Siap Kirim Notifikasi WA</span>
        </div>
      </div>

      <div class="card-modern p-5 flex flex-col justify-between">
        <div>
          <span class="text-xs text-text/50 uppercase font-bold">Total Broadcast Terkirim</span>
          <p class="font-extrabold text-2xl text-text mt-1">{{ broadcasts.length }} Pesan</p>
        </div>
        <p class="text-[10px] text-text/40">Log data pengiriman otomatis disimpan untuk audit trail harian.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Composer -->
      <div class="card-modern p-6 lg:col-span-1 space-y-4">
        <h3 class="font-bold text-lg text-text">Kirim Broadcast Baru</h3>
        
        <form @submit.prevent="sendBroadcast" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Nomor WhatsApp Penerima (Wali Murid / Guru)</label>
            <input v-model="recipient" type="text" class="input-modern text-xs" placeholder="e.g. 081234567890" required />
          </div>
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Pesan Pengumuman</label>
            <textarea v-model="message" class="input-modern h-32 text-xs resize-none" placeholder="Tulis pengumuman di sini..." required></textarea>
          </div>
          <button type="submit" class="w-full btn-primary text-xs py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center justify-center">
            <Send class="w-4 h-4 mr-1.5" /> Kirim Sekarang
          </button>
        </form>
      </div>

      <!-- History -->
      <div class="card-modern p-6 lg:col-span-2 space-y-4">
        <h3 class="font-bold text-lg text-text flex items-center">
          <History class="w-5 h-5 mr-2 text-primary" /> Histori Broadcast Terakhir
        </h3>

        <div v-if="isLoading" class="p-8 text-center text-text/50">
          Loading broadcast logs...
        </div>
        <div v-else-if="broadcasts.length === 0" class="p-8 text-center text-text/40">
          Belum ada log pengiriman broadcast.
        </div>
        <div v-else class="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <div v-for="bc in broadcasts" :key="bc.id" class="p-3.5 bg-gradient-to-br from-surface to-background border border-border/80 rounded-xl space-y-1">
            <div class="flex justify-between items-center text-[10px]">
              <span class="text-primary font-bold">Ke: {{ bc.recipient }}</span>
              <span class="text-text/40">{{ bc.sent_at }}</span>
            </div>
            <p class="text-xs text-text/80 leading-relaxed font-mono mt-1 bg-white p-2.5 rounded-lg border border-border/50">
              {{ bc.message }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

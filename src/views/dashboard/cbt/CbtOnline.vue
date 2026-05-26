<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ClipboardList, Shield, Zap, RefreshCw, Trophy, Clock, Plus, X } from 'lucide-vue-next'

const antiRefresh = ref(true)
const exams = ref<any[]>([])
const classes = ref<any[]>([])
const isLoading = ref(false)

const showModal = ref(false)
const newExam = ref({
  title: '',
  class_id: '',
  duration: '90 Menit',
  date: '',
  token: '',
  status: 'Aktif'
})

const fetchExams = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('/api/cbt/exams')
    exams.value = res.data
  } catch (error) {
    console.error('Failed to fetch exams:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchClasses = async () => {
  try {
    const res = await axios.get('/api/classes')
    classes.value = res.data
  } catch (error) {
    console.error('Failed to fetch classes:', error)
  }
}

const randomToken = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let token = ''
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

const generateNewToken = async (exam: any) => {
  const token = randomToken()
  try {
    await axios.put(`/api/cbt/exams/${exam.id}`, {
      ...exam,
      token
    })
    exam.token = token
  } catch (error) {
    console.error('Failed to update token:', error)
  }
}

const createExam = async () => {
  if (!newExam.value.token) {
    newExam.value.token = randomToken()
  }
  try {
    await axios.post('/api/cbt/exams', newExam.value)
    showModal.value = false
    newExam.value = {
      title: '',
      class_id: '',
      duration: '90 Menit',
      date: '',
      token: '',
      status: 'Aktif'
    }
    fetchExams()
  } catch (error) {
    console.error('Failed to create exam:', error)
  }
}

const getClassName = (classId: string) => {
  const cls = classes.value.find(c => c.id === classId)
  return cls ? `Kelas ${cls.level} - ${cls.name}` : '-'
}

onMounted(() => {
  fetchExams()
  fetchClasses()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5">
      <div>
        <h1 class="text-3xl font-extrabold text-text flex items-center tracking-tight">
          <ClipboardList class="w-8 h-8 mr-3 text-primary" />
          CBT Online System (Ujian Digital)
        </h1>
        <p class="text-text/60 text-sm mt-1">Kelola ujian online, acak soal, token ujian, dan sistem anti-curang realtime.</p>
      </div>
      <div class="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-2.5 rounded-2xl shadow-lg border border-yellow-400/20">
        <Shield class="w-5 h-5 text-yellow-400 fill-current animate-pulse" />
        <span class="text-xs font-bold">Secure Lock Mode Enabled</span>
      </div>
    </div>

    <!-- Stats & Security Configurations -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card-modern p-5 flex items-center space-x-4 border-l-4 border-l-primary">
        <div class="p-3 bg-primary/10 text-primary rounded-xl">
          <Shield class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs text-text/50 uppercase font-bold">Anti-Refresh Guard</span>
          <div class="flex items-center mt-1 space-x-2">
            <span class="font-bold text-sm" :class="antiRefresh ? 'text-success' : 'text-danger'">
              {{ antiRefresh ? 'Proteksi Aktif' : 'Non-Aktif' }}
            </span>
            <input type="checkbox" v-model="antiRefresh" class="rounded text-primary w-4 h-4 cursor-pointer" />
          </div>
        </div>
      </div>

      <div class="card-modern p-5 flex items-center space-x-4 border-l-4 border-l-yellow-500">
        <div class="p-3 bg-yellow-500/10 text-yellow-600 rounded-xl">
          <Zap class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs text-text/50 uppercase font-bold">Simulasi Ujian</span>
          <p class="font-extrabold text-lg text-text">Dukungan Multi-Jenjang</p>
        </div>
      </div>

      <div class="card-modern p-5 flex items-center space-x-4 border-l-4 border-l-success">
        <div class="p-3 bg-success/10 text-success rounded-xl">
          <Trophy class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs text-text/50 uppercase font-bold">Auto-Correction</span>
          <p class="font-extrabold text-lg text-text">Sistem Penilaian Instan</p>
        </div>
      </div>
    </div>

    <!-- Exam Table -->
    <div class="card-modern p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-bold text-lg text-text flex items-center">
          <Clock class="w-5 h-5 mr-2 text-primary" /> Jadwal & Token Ujian Aktif
        </h3>
        <button @click="showModal = true" class="btn-primary text-xs py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center">
          <Plus class="w-4 h-4 mr-1" /> Buat Ujian Baru
        </button>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-text/50">
        Loading exams data...
      </div>
      <div v-else-if="exams.length === 0" class="p-8 text-center text-text/40">
        Belum ada ujian yang dijadwalkan. Klik "Buat Ujian Baru" untuk menambahkan.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-border bg-background/50">
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Ujian / Agenda</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Kelas</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Durasi</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Tanggal</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Token</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Status</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="exam in exams" :key="exam.id" class="hover:bg-background/40 transition-colors">
              <td class="p-3 text-sm font-semibold text-text">{{ exam.title }}</td>
              <td class="p-3 text-xs text-text/70">{{ getClassName(exam.class_id) }}</td>
              <td class="p-3 text-xs text-text/70">{{ exam.duration }}</td>
              <td class="p-3 text-xs text-text/70">{{ exam.date }}</td>
              <td class="p-3 text-xs font-mono font-bold">
                <span class="bg-yellow-500/10 text-yellow-600 border border-yellow-400/30 px-2 py-0.5 rounded-lg">
                  {{ exam.token }}
                </span>
              </td>
              <td class="p-3 text-xs">
                <span :class="[
                  'px-2 py-0.5 rounded-full font-medium text-[10px]',
                  exam.status === 'Aktif' ? 'bg-success/10 text-success' : 'bg-text/10 text-text/60'
                ]">
                  {{ exam.status }}
                </span>
              </td>
              <td class="p-3 text-xs text-right space-x-2">
                <button @click="generateNewToken(exam)" class="text-primary hover:text-secondary inline-flex items-center bg-primary/10 p-1.5 rounded-lg transition-all" title="Acak Token">
                  <RefreshCw class="w-4 h-4" />
                </button>
                <button class="btn-primary text-[10px] py-1 px-2.5 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none">
                  Mulai
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-blue-950/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border animate-in zoom-in-95 duration-200">
        <div class="flex justify-between items-center border-b border-border pb-3 mb-4">
          <h3 class="font-extrabold text-lg text-text">Tambah Ujian CBT Baru</h3>
          <button @click="showModal = false" class="text-text/50 hover:text-text">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="createExam" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Judul / Agenda Ujian</label>
            <input v-model="newExam.title" type="text" class="input-modern" placeholder="e.g. Penilaian Harian Matematika" required />
          </div>

          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Pilih Kelas</label>
            <select v-model="newExam.class_id" class="input-modern" required>
              <option value="" disabled>-- Pilih Kelas --</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                Kelas {{ cls.level }} - {{ cls.name }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Durasi</label>
              <input v-model="newExam.duration" type="text" class="input-modern" placeholder="e.g. 90 Menit" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Tanggal</label>
              <input v-model="newExam.date" type="text" class="input-modern" placeholder="e.g. 28 Mei 2026" required />
            </div>
          </div>

          <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-800">
            Token ujian akan otomatis dibuat secara acak apabila tidak diisi manual.
          </div>

          <div class="flex justify-end space-x-2 pt-4 border-t border-border">
            <button type="button" @click="showModal = false" class="px-4 py-2 border border-border text-xs font-bold rounded-xl text-text hover:bg-background">
              Batal
            </button>
            <button type="submit" class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark">
              Simpan Ujian
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

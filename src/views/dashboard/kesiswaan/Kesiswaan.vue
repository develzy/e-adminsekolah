<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Calendar, Award, AlertTriangle, Activity, CheckCircle, Plus, X } from 'lucide-vue-next'

const selectedSection = ref('absensi') // 'absensi' | 'prestasi' | 'pelanggaran'
const students = ref<any[]>([])
const classes = ref<any[]>([])

const attendanceData = ref<any[]>([])
const achievements = ref<any[]>([])
const violations = ref<any[]>([])

const isLoading = ref(false)
const showModal = ref(false)

// Modals forms
const formAttendance = ref({
  date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  student_id: '',
  class_id: '',
  status: 'Sakit',
  info: ''
})

const formAchievement = ref({
  student_id: '',
  title: '',
  date: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
  type: 'Akademik'
})

const formViolation = ref({
  student_id: '',
  type: '',
  point: 5,
  date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
})

const fetchInitialData = async () => {
  try {
    const [stdRes, clsRes] = await Promise.all([
      axios.get('/api/students'),
      axios.get('/api/classes')
    ])
    students.value = stdRes.data
    classes.value = clsRes.data
  } catch (error) {
    console.error('Failed to fetch initial kesiswaan data:', error)
  }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const [attRes, achRes, vioRes] = await Promise.all([
      axios.get('/api/kesiswaan/attendance'),
      axios.get('/api/kesiswaan/achievements'),
      axios.get('/api/kesiswaan/violations')
    ])
    attendanceData.value = attRes.data
    achievements.value = achRes.data
    violations.value = vioRes.data
  } catch (error) {
    console.error('Failed to fetch transaction data:', error)
  } finally {
    isLoading.value = false
  }
}

const submitAttendance = async () => {
  try {
    // Find class of selected student
    const student = students.value.find(s => s.id === formAttendance.value.student_id)
    if (student) {
      formAttendance.value.class_id = student.class_id || ''
    }
    await axios.post('/api/kesiswaan/attendance', formAttendance.value)
    showModal.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const submitAchievement = async () => {
  try {
    await axios.post('/api/kesiswaan/achievements', formAchievement.value)
    showModal.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const submitViolation = async () => {
  try {
    await axios.post('/api/kesiswaan/violations', formViolation.value)
    showModal.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const getClassName = (classId: string) => {
  const cls = classes.value.find(c => c.id === classId)
  return cls ? `Kelas ${cls.level} - ${cls.name}` : '-'
}

onMounted(() => {
  fetchInitialData()
  fetchData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5">
      <div>
        <h1 class="text-3xl font-extrabold text-text flex items-center tracking-tight">
          <Activity class="w-8 h-8 mr-3 text-primary" />
          Modul Kesiswaan & Absensi
        </h1>
        <p class="text-text/60 text-sm mt-1">Pantau absensi harian siswa, ekstrakurikuler, prestasi akademik/non-akademik, serta pelanggaran tata tertib.</p>
      </div>
      <div class="mt-4 md:mt-0 flex gap-2">
        <button 
          v-for="sec in [
            { id: 'absensi', label: '📅 Absensi', icon: Calendar },
            { id: 'prestasi', label: '🏆 Prestasi', icon: Award },
            { id: 'pelanggaran', label: '⚠️ Pelanggaran', icon: AlertTriangle }
          ]" 
          :key="sec.id"
          @click="selectedSection = sec.id"
          :class="[
            'px-4 py-2.5 rounded-xl font-bold text-xs flex items-center transition-all duration-200 border',
            selectedSection === sec.id 
              ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white border-blue-950 shadow-md'
              : 'bg-surface text-text/80 hover:bg-background/80 border-border'
          ]"
        >
          <component :is="sec.icon" class="w-4 h-4 mr-1.5" />
          {{ sec.label }}
        </button>
      </div>
    </div>

    <!-- 1. ABSENSI SECTION -->
    <div v-if="selectedSection === 'absensi'" class="card-modern p-6 space-y-6 animate-in fade-in duration-300">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg text-text">Jurnal Absensi Harian Siswa</h3>
        <button @click="showModal = true" class="btn-primary text-xs py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center">
          <Plus class="w-4 h-4 mr-1" /> Input Absensi Baru
        </button>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-text/50">
        Loading attendance data...
      </div>
      <div v-else-if="attendanceData.length === 0" class="p-8 text-center text-text/40">
        Belum ada rekam kehadiran hari ini. Klik "Input Absensi Baru" untuk menambahkan.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-border bg-background/50">
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Tanggal</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Nama Siswa</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Kelas</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Status</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Keterangan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="att in attendanceData" :key="att.id" class="hover:bg-background/40 transition-colors">
              <td class="p-3 text-xs text-text/70">{{ att.date }}</td>
              <td class="p-3 text-sm font-semibold text-text">{{ att.student_name || 'Siswa' }}</td>
              <td class="p-3 text-xs text-text/60">{{ getClassName(att.class_id) }}</td>
              <td class="p-3 text-xs">
                <span class="px-2 py-0.5 rounded-full font-bold text-[10px]"
                  :class="{
                    'bg-yellow-100 text-yellow-800': att.status === 'Sakit' || att.status === 'Izin',
                    'bg-red-100 text-red-800': att.status === 'Alfa'
                  }"
                >
                  {{ att.status }}
                </span>
              </td>
              <td class="p-3 text-xs text-text/60">{{ att.info }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. PRESTASI SECTION -->
    <div v-else-if="selectedSection === 'prestasi'" class="card-modern p-6 space-y-6 animate-in fade-in duration-300">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg text-text">Buku Catatan Prestasi Siswa</h3>
        <button @click="showModal = true" class="btn-primary text-xs py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center">
          <Plus class="w-4 h-4 mr-1" /> Catat Prestasi
        </button>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-text/50">
        Loading achievements data...
      </div>
      <div v-else-if="achievements.length === 0" class="p-8 text-center text-text/40">
        Belum ada prestasi yang dicatat. Klik "Catat Prestasi" untuk menambahkan.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="ac in achievements" :key="ac.id" class="bg-gradient-to-br from-surface to-background p-5 rounded-2xl border border-border/80 relative hover:shadow-md transition-all">
          <div class="absolute right-4 top-4 bg-yellow-500/10 text-yellow-600 border border-yellow-400/20 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase">
            {{ ac.type }}
          </div>
          <h4 class="font-bold text-text text-sm">{{ ac.title }}</h4>
          <p class="text-xs text-text/50 mt-1">Siswa: <span class="font-semibold text-primary">{{ ac.student_name }}</span></p>
          <p class="text-[10px] text-text/40 mt-3 flex items-center">
            <CheckCircle class="w-3.5 h-3.5 mr-1 text-success" /> Tercatat tanggal: {{ ac.date }}
          </p>
        </div>
      </div>
    </div>

    <!-- 3. PELANGGARAN SECTION -->
    <div v-else-if="selectedSection === 'pelanggaran'" class="card-modern p-6 space-y-6 animate-in fade-in duration-300">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg text-text">Rekap Pelanggaran & Poin Tata Tertib</h3>
        <button @click="showModal = true" class="btn-primary text-xs py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center">
          <Plus class="w-4 h-4 mr-1" /> Catat Pelanggaran
        </button>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-text/50">
        Loading violations data...
      </div>
      <div v-else-if="violations.length === 0" class="p-8 text-center text-text/40">
        Belum ada data pelanggaran yang terinput.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-border bg-background/50">
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Tanggal</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Nama Siswa</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Tipe Pelanggaran</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase text-center">Akumulasi Poin</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="vl in violations" :key="vl.id" class="hover:bg-background/40 transition-colors">
              <td class="p-3 text-xs text-text/70">{{ vl.date }}</td>
              <td class="p-3 text-sm font-semibold text-text">{{ vl.student_name || 'Siswa' }}</td>
              <td class="p-3 text-xs text-danger font-semibold">{{ vl.type }}</td>
              <td class="p-3 text-xs text-center font-bold">
                <span class="bg-danger/10 text-danger border border-danger/20 px-2 py-0.5 rounded-lg">
                  +{{ vl.point }} Poin
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showModal" class="fixed inset-0 bg-blue-950/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border animate-in zoom-in-95 duration-200">
        <div class="flex justify-between items-center border-b border-border pb-3 mb-4">
          <h3 class="font-extrabold text-lg text-text">
            Tambah Data {{ selectedSection === 'absensi' ? 'Absensi' : (selectedSection === 'prestasi' ? 'Prestasi' : 'Pelanggaran') }}
          </h3>
          <button @click="showModal = false" class="text-text/50 hover:text-text">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Attendance form -->
        <form v-if="selectedSection === 'absensi'" @submit.prevent="submitAttendance" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Pilih Siswa</label>
            <select v-model="formAttendance.student_id" class="input-modern" required>
              <option value="" disabled>-- Pilih Siswa --</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }} (NISN: {{ s.nisn }})</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Status</label>
              <select v-model="formAttendance.status" class="input-modern">
                <option>Sakit</option>
                <option>Izin</option>
                <option>Alfa</option>
                <option>Hadir</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Tanggal</label>
              <input v-model="formAttendance.date" type="text" class="input-modern" required />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Keterangan / Info Tambahan</label>
            <input v-model="formAttendance.info" type="text" class="input-modern" placeholder="e.g. Acara keluarga / Demam tinggi" />
          </div>
          <button type="submit" class="w-full btn-primary mt-4 py-2 text-white bg-primary">Simpan Kehadiran</button>
        </form>

        <!-- Achievement form -->
        <form v-else-if="selectedSection === 'prestasi'" @submit.prevent="submitAchievement" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Pilih Siswa</label>
            <select v-model="formAchievement.student_id" class="input-modern" required>
              <option value="" disabled>-- Pilih Siswa --</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Judul Prestasi / Penghargaan</label>
            <input v-model="formAchievement.title" type="text" class="input-modern" placeholder="e.g. Juara 1 Lomba Pidato Bahasa Arab" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Kategori</label>
              <select v-model="formAchievement.type" class="input-modern">
                <option>Akademik</option>
                <option>Non-Akademik</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Bulan/Tahun</label>
              <input v-model="formAchievement.date" type="text" class="input-modern" required />
            </div>
          </div>
          <button type="submit" class="w-full btn-primary mt-4 py-2 text-white bg-primary">Simpan Prestasi</button>
        </form>

        <!-- Violation form -->
        <form v-else-if="selectedSection === 'pelanggaran'" @submit.prevent="submitViolation" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Pilih Siswa</label>
            <select v-model="formViolation.student_id" class="input-modern" required>
              <option value="" disabled>-- Pilih Siswa --</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Jenis Pelanggaran</label>
            <input v-model="formViolation.type" type="text" class="input-modern" placeholder="e.g. Terlambat masuk gerbang sekolah" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Bobot Poin</label>
              <input v-model.number="formViolation.point" type="number" class="input-modern" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Tanggal</label>
              <input v-model="formViolation.date" type="text" class="input-modern" required />
            </div>
          </div>
          <button type="submit" class="w-full btn-primary mt-4 py-2 text-white bg-primary">Simpan Pelanggaran</button>
        </form>
      </div>
    </div>
  </div>
</template>

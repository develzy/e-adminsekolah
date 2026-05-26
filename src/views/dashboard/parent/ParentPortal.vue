<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Users, GraduationCap, CheckCircle, FileText, Send, Calendar } from 'lucide-vue-next'

const router = useRouter()
const selectedKid = ref('')
const kids = ref<any[]>([])
const isLoading = ref(false)

const kidStats = ref({
  hadir: 0,
  sakit: 0,
  izin: 0,
  alfa: 0
})

const kidGrades = ref<any[]>([])

const fetchInitialData = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('/api/students')
    kids.value = res.data
    if (kids.value.length > 0) {
      selectedKid.value = kids.value[0].id
    }
  } catch (error) {
    console.error('Failed to load students:', error)
  } finally {
    isLoading.value = false
  }
}

const loadKidDetails = async () => {
  if (!selectedKid.value) return
  
  try {
    const [attRes, grdRes] = await Promise.all([
      axios.get('/api/kesiswaan/attendance'),
      axios.get('/api/grades')
    ])
    
    // Filter attendance for the selected student
    const studentAtt = attRes.data.filter((a: any) => a.student_id === selectedKid.value)
    const stats = { hadir: 0, sakit: 0, izin: 0, alfa: 0 }
    
    studentAtt.forEach((a: any) => {
      if (a.status === 'Hadir') stats.hadir++
      else if (a.status === 'Sakit') stats.sakit++
      else if (a.status === 'Izin') stats.izin++
      else if (a.status === 'Alfa') stats.alfa++
    })
    kidStats.value = stats

    // Filter grades for the selected student
    const studentGrades = grdRes.data.filter((g: any) => g.student_id === selectedKid.value)
    kidGrades.value = studentGrades
  } catch (error) {
    console.error('Failed to load kid details:', error)
  }
}

watch(selectedKid, () => {
  loadKidDetails()
})

const getSelectedKidInfo = () => {
  return kids.value.find(k => k.id === selectedKid.value)
}

const downloadReport = () => {
  router.push('/dashboard/reports')
}

onMounted(() => {
  fetchInitialData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5">
      <div>
        <h1 class="text-3xl font-extrabold text-text flex items-center tracking-tight">
          <Users class="w-8 h-8 mr-3 text-primary" />
          Parent Portal (Akses Wali Murid)
        </h1>
        <p class="text-text/60 text-sm mt-1">Pantau perkembangan akademik, kehadiran, serta unduh raport digital anak Anda.</p>
      </div>
      
      <!-- Kid Selector -->
      <div class="mt-4 md:mt-0 flex items-center space-x-2">
        <label class="text-xs font-bold text-text/60">Pilih Anak:</label>
        <select v-model="selectedKid" class="input-modern w-48" :disabled="isLoading">
          <option v-if="kids.length === 0" value="">Belum ada data siswa</option>
          <option v-for="k in kids" :key="k.id" :value="k.id">{{ k.name }} (NISN: {{ k.nisn }})</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="p-8 text-center text-text/50">
      Loading parent portal data...
    </div>
    
    <div v-else-if="!selectedKid" class="p-8 text-center text-text/40">
      Wali murid tidak terhubung ke siswa mana pun.
    </div>

    <div v-else class="space-y-6">
      <!-- Kid Overview Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card-modern p-5 flex items-center space-x-4">
          <div class="p-3 bg-primary/10 text-primary rounded-xl">
            <GraduationCap class="w-6 h-6" />
          </div>
          <div>
            <span class="text-xs text-text/50 uppercase font-bold">Nama / NISN</span>
            <p class="font-extrabold text-sm text-text mt-0.5">{{ getSelectedKidInfo()?.name }}</p>
            <p class="text-[10px] text-text/40">NISN: {{ getSelectedKidInfo()?.nisn || '-' }}</p>
          </div>
        </div>

        <div class="card-modern p-5 flex items-center space-x-4 border-l-4 border-l-success">
          <div class="p-3 bg-success/10 text-success rounded-xl">
            <CheckCircle class="w-6 h-6" />
          </div>
          <div>
            <span class="text-xs text-text/50 uppercase font-bold">Kehadiran (Hadir)</span>
            <p class="font-extrabold text-xl text-text mt-0.5">{{ kidStats.hadir }} Hari</p>
            <p class="text-[10px] text-text/40">Sakit: {{ kidStats.sakit }} | Izin: {{ kidStats.izin }} | Alfa: {{ kidStats.alfa }}</p>
          </div>
        </div>

        <div class="card-modern p-5 flex items-center space-x-4">
          <div class="p-3 bg-yellow-500/10 text-yellow-600 rounded-xl">
            <Calendar class="w-6 h-6" />
          </div>
          <div>
            <span class="text-xs text-text/50 uppercase font-bold">Tahun Ajaran</span>
            <p class="font-extrabold text-sm text-text mt-0.5">2026/2027</p>
            <p class="text-[10px] text-text/40">Semester: Ganjil</p>
          </div>
        </div>

        <div @click="downloadReport" class="card-modern p-5 flex items-center space-x-4 border-l-4 border-l-primary cursor-pointer hover:shadow-md transition-all">
          <div class="p-3 bg-primary/10 text-primary rounded-xl">
            <FileText class="w-6 h-6" />
          </div>
          <div>
            <span class="text-xs text-text/50 uppercase font-bold">Laporan Belajar</span>
            <p class="font-extrabold text-sm text-text mt-0.5 text-primary">Download Raport</p>
            <p class="text-[10px] text-text/40">Format PDF F4 Resmi</p>
          </div>
        </div>
      </div>

      <!-- Student Grades Table -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="card-modern p-6 lg:col-span-2">
          <h3 class="font-bold text-lg text-text mb-4">Nilai Akademik Terkini</h3>
          <div v-if="kidGrades.length === 0" class="p-8 text-center text-text/40">
            Belum ada nilai akademik yang diinput oleh guru pelajaran.
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-border bg-background/50">
                  <th class="p-3 text-xs font-bold text-text/70 uppercase">Mata Pelajaran</th>
                  <th class="p-3 text-xs font-bold text-text/70 uppercase">Kategori</th>
                  <th class="p-3 text-xs font-bold text-text/70 uppercase text-center">Nilai</th>
                  <th class="p-3 text-xs font-bold text-text/70 uppercase">Catatan Guru</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr v-for="g in kidGrades" :key="g.id" class="hover:bg-background/40 transition-colors">
                  <td class="p-3 text-sm font-semibold text-text">{{ g.subject }}</td>
                  <td class="p-3 text-xs text-text/60 uppercase">{{ g.type }}</td>
                  <td class="p-3 text-sm text-center font-bold" :class="g.score >= 75 ? 'text-success' : 'text-danger'">{{ g.score }}</td>
                  <td class="p-3 text-xs text-text/60">{{ g.feedback || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Announcements & Communications -->
        <div class="card-modern p-6 space-y-4">
          <h3 class="font-bold text-lg text-text flex items-center">
            📢 Pengumuman Sekolah
          </h3>
          
          <div class="bg-blue-50/50 border border-blue-100/50 p-4 rounded-xl space-y-2">
            <div class="flex justify-between items-center">
              <h4 class="font-bold text-xs text-blue-900">Pembagian Raport F4</h4>
              <span class="text-[9px] text-text/40 font-medium">Juni 2026</span>
            </div>
            <p class="text-xs text-blue-950/80 leading-relaxed">Harap orang tua/wali siswa hadir tepat waktu untuk penyerahan raport fisik dan tanda tangan dokumen resmi F4.</p>
          </div>

          <div class="border-t border-border pt-4">
            <h4 class="font-bold text-xs text-text mb-2">Hubungi Wali Kelas</h4>
            <textarea class="input-modern h-20 text-xs resize-none" placeholder="Tulis pesan Anda untuk wali kelas di sini..."></textarea>
            <button class="w-full btn-primary text-xs py-2 mt-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center justify-center">
              <Send class="w-3.5 h-3.5 mr-1" /> Kirim Pesan WA
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

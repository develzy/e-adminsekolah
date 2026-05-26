<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Briefcase, Award, Cpu, Plus, X } from 'lucide-vue-next'

const selectedTab = ref('pkl')
const students = ref<any[]>([])
const pklRecords = ref<any[]>([])
const certRecords = ref<any[]>([])
const isLoading = ref(false)
const showModal = ref(false)

// Forms
const formPkl = ref({
  student_id: '',
  company_name: '',
  duration: '3 Bulan',
  grade: 'A',
  status: 'Aktif'
})

const formCert = ref({
  student_id: '',
  cert_name: '',
  examiner: 'LSP-P1 / BNSP',
  date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  grade: 'Sangat Kompeten',
  status: 'Lulus'
})

const fetchInitialData = async () => {
  try {
    const res = await axios.get('/api/students')
    students.value = res.data
  } catch (error) {
    console.error('Failed to load students:', error)
  }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const [pklRes, certRes] = await Promise.all([
      axios.get('/api/smk/pkl'),
      axios.get('/api/smk/certifications')
    ])
    pklRecords.value = pklRes.data
    certRecords.value = certRes.data
  } catch (error) {
    console.error('Failed to load SMK data:', error)
  } finally {
    isLoading.value = false
  }
}

const submitPkl = async () => {
  try {
    await axios.post('/api/smk/pkl', formPkl.value)
    showModal.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const submitCert = async () => {
  try {
    await axios.post('/api/smk/certifications', formCert.value)
    showModal.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchInitialData()
  fetchData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5">
      <div>
        <h1 class="text-3xl font-extrabold text-text flex items-center tracking-tight">
          <Cpu class="w-8 h-8 mr-3 text-primary" />
          SMK Center & Vokasi
        </h1>
        <p class="text-text/60 text-sm mt-1">Kelola program Praktek Kerja Lapangan (PKL), sertifikasi keahlian, dan hubungan industri (TeFa).</p>
      </div>
      <div class="mt-4 md:mt-0 flex gap-2">
        <button 
          v-for="tab in [
            { id: 'pkl', label: '💼 Prakerin / PKL' },
            { id: 'cert', label: '🏆 Sertifikasi Keahlian' }
          ]" 
          :key="tab.id"
          @click="selectedTab = tab.id"
          :class="[
            'px-4 py-2.5 rounded-xl font-bold text-xs flex items-center transition-all duration-200 border',
            selectedTab === tab.id 
              ? 'bg-gradient-to-br from-blue-900 to-blue-800 text-white border-blue-950 shadow-md'
              : 'bg-surface text-text/80 hover:bg-background/80 border-border'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- PKL Tab -->
    <div v-if="selectedTab === 'pkl'" class="card-modern p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg text-text flex items-center">
          <Briefcase class="w-5 h-5 mr-2 text-primary" /> Jurnal Penempatan PKL Siswa
        </h3>
        <button @click="showModal = true" class="btn-primary text-xs py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center">
          <Plus class="w-4 h-4 mr-1" /> Plotting PKL Baru
        </button>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-text/50">
        Loading PKL records...
      </div>
      <div v-else-if="pklRecords.length === 0" class="p-8 text-center text-text/40">
        Belum ada penempatan PKL aktif. Klik "Plotting PKL Baru" untuk menambahkan.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-border bg-background/50">
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Siswa</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Perusahaan / DUDI</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Durasi</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Nilai Industri</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="rec in pklRecords" :key="rec.id" class="hover:bg-background/40 transition-colors">
              <td class="p-3 text-sm font-semibold text-text">{{ rec.student_name || 'Siswa' }}</td>
              <td class="p-3 text-xs text-text/70 font-bold text-primary">{{ rec.company_name }}</td>
              <td class="p-3 text-xs text-text/60">{{ rec.duration }}</td>
              <td class="p-3 text-xs font-bold text-yellow-600">{{ rec.grade }}</td>
              <td class="p-3 text-xs">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success">
                  {{ rec.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Certifications Tab -->
    <div v-else-if="selectedTab === 'cert'" class="card-modern p-6 space-y-6">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg text-text flex items-center">
          <Award class="w-5 h-5 mr-2 text-primary" /> Sertifikasi Profesi & BNSP
        </h3>
        <button @click="showModal = true" class="btn-primary text-xs py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center">
          <Plus class="w-4 h-4 mr-1" /> Catat Kelulusan
        </button>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-text/50">
        Loading certification records...
      </div>
      <div v-else-if="certRecords.length === 0" class="p-8 text-center text-text/40">
        Belum ada pencatatan sertifikasi. Klik "Catat Kelulusan" untuk menambahkan.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-border bg-background/50">
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Siswa</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Skema Sertifikasi</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Lembaga Sertifikasi</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Tanggal Uji</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Predikat</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="rec in certRecords" :key="rec.id" class="hover:bg-background/40 transition-colors">
              <td class="p-3 text-sm font-semibold text-text">{{ rec.student_name || 'Siswa' }}</td>
              <td class="p-3 text-xs text-text/70 font-bold text-primary">{{ rec.cert_name }}</td>
              <td class="p-3 text-xs text-text/60">{{ rec.examiner }}</td>
              <td class="p-3 text-xs text-text/50">{{ rec.date }}</td>
              <td class="p-3 text-xs">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-600 border border-yellow-400/20">
                  {{ rec.grade }}
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
            Tambah Data {{ selectedTab === 'pkl' ? 'Penempatan PKL' : 'Sertifikasi Keahlian' }}
          </h3>
          <button @click="showModal = false" class="text-text/50 hover:text-text">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- PKL Form -->
        <form v-if="selectedTab === 'pkl'" @submit.prevent="submitPkl" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Pilih Siswa SMK</label>
            <select v-model="formPkl.student_id" class="input-modern" required>
              <option value="" disabled>-- Pilih Siswa --</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Nama Perusahaan / DUDI</label>
            <input v-model="formPkl.company_name" type="text" class="input-modern" placeholder="e.g. PT. Develzy Teknologi Indonesia" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Durasi PKL</label>
              <select v-model="formPkl.duration" class="input-modern">
                <option>3 Bulan</option>
                <option>6 Bulan</option>
                <option>1 Tahun</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Nilai Industri</label>
              <select v-model="formPkl.grade" class="input-modern">
                <option>A (Sangat Baik)</option>
                <option>B (Baik)</option>
                <option>C (Cukup)</option>
              </select>
            </div>
          </div>
          <button type="submit" class="w-full btn-primary mt-4 py-2 text-white bg-primary">Plotting Siswa</button>
        </form>

        <!-- Cert Form -->
        <form v-else-if="selectedTab === 'cert'" @submit.prevent="submitCert" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Pilih Siswa</label>
            <select v-model="formCert.student_id" class="input-modern" required>
              <option value="" disabled>-- Pilih Siswa --</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Skema / Kompetensi Sertifikasi</label>
            <input v-model="formCert.cert_name" type="text" class="input-modern" placeholder="e.g. Rekayasa Perangkat Lunak (RPL)" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Lembaga Penguji</label>
              <input v-model="formCert.examiner" type="text" class="input-modern" placeholder="e.g. LSP BNSP" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Predikat</label>
              <input v-model="formCert.grade" type="text" class="input-modern" placeholder="e.g. Kompeten / Sangat Baik" required />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Tanggal Kelulusan</label>
            <input v-model="formCert.date" type="text" class="input-modern" required />
          </div>
          <button type="submit" class="w-full btn-primary mt-4 py-2 text-white bg-primary">Simpan Kelulusan</button>
        </form>
      </div>
    </div>
  </div>
</template>

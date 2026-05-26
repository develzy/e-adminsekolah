<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { BookOpen, Plus, X } from 'lucide-vue-next'

const selectedTab = ref('hafalan')
const students = ref<any[]>([])
const hafalanRecords = ref<any[]>([])
const soroganLogs = ref<any[]>([])
const isLoading = ref(false)
const showModal = ref(false)

// Forms
const formHafalan = ref({
  student_id: '',
  kitab: 'Al-Qur\'an',
  juz: '',
  surah: '',
  status: 'Lancar',
  date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
})

const formSorogan = ref({
  student_id: '',
  kitab: '',
  bab: '',
  catatan: '',
  ustadz: ''
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
    const [hafRes, sorRes] = await Promise.all([
      axios.get('/api/pesantren/hafalan'),
      axios.get('/api/pesantren/sorogan')
    ])
    hafalanRecords.value = hafRes.data
    soroganLogs.value = sorRes.data
  } catch (error) {
    console.error('Failed to fetch pesantren transactions:', error)
  } finally {
    isLoading.value = false
  }
}

const submitHafalan = async () => {
  try {
    await axios.post('/api/pesantren/hafalan', formHafalan.value)
    showModal.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const submitSorogan = async () => {
  try {
    await axios.post('/api/pesantren/sorogan', formSorogan.value)
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
    <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5">
      <div>
        <h1 class="text-3xl font-extrabold text-text flex items-center tracking-tight">
          <BookOpen class="w-8 h-8 mr-3 text-primary" />
          Pesantren Module (Hafalan & Kitab)
        </h1>
        <p class="text-text/60 text-sm mt-1">Pantau setoran hafalan Al-Qur'an, sorogan kitab kuning, bandongan, dan penilaian ujian diniyah.</p>
      </div>
      <div class="mt-4 md:mt-0 flex gap-2">
        <button 
          v-for="tab in [
            { id: 'hafalan', label: '📖 Hafalan Qur\'an & Kitab' },
            { id: 'sorogan', label: '💡 Sorogan & Bandongan' }
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

    <!-- HAFALAN TAB -->
    <div v-if="selectedTab === 'hafalan'" class="card-modern p-6 space-y-6 animate-in fade-in duration-300">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg text-text">Buku Setoran Hafalan Santri</h3>
        <button @click="showModal = true" class="btn-primary text-xs py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center">
          <Plus class="w-4 h-4 mr-1" /> Setoran Baru
        </button>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-text/50">
        Loading hafalan records...
      </div>
      <div v-else-if="hafalanRecords.length === 0" class="p-8 text-center text-text/40">
        Belum ada catatan setoran hafalan. Klik "Setoran Baru" untuk menambahkan.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-border bg-background/50">
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Santri</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Materi/Kitab</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Juz/Bait</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Surah/Fokus</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Status</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Tanggal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="rec in hafalanRecords" :key="rec.id" class="hover:bg-background/40 transition-colors">
              <td class="p-3 text-sm font-semibold text-text">{{ rec.student_name || 'Santri' }}</td>
              <td class="p-3 text-xs text-text/70 font-bold text-primary">{{ rec.kitab }}</td>
              <td class="p-3 text-xs text-text/60">{{ rec.juz }}</td>
              <td class="p-3 text-xs text-text/60">{{ rec.surah }}</td>
              <td class="p-3 text-xs">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  :class="rec.status === 'Lancar' ? 'bg-success/10 text-success' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ rec.status }}
                </span>
              </td>
              <td class="p-3 text-xs text-text/50">{{ rec.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SOROGAN TAB -->
    <div v-else-if="selectedTab === 'sorogan'" class="card-modern p-6 space-y-6 animate-in fade-in duration-300">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-lg text-text">Buku Jurnal Sorogan Kitab Kuning</h3>
        <button @click="showModal = true" class="btn-primary text-xs py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center">
          <Plus class="w-4 h-4 mr-1" /> Sorogan Baru
        </button>
      </div>

      <div v-if="isLoading" class="p-8 text-center text-text/50">
        Loading sorogan logs...
      </div>
      <div v-else-if="soroganLogs.length === 0" class="p-8 text-center text-text/40">
        Belum ada catatan jurnal sorogan. Klik "Sorogan Baru" untuk menambahkan.
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="log in soroganLogs" :key="log.id" class="bg-gradient-to-br from-surface to-background p-5 rounded-2xl border border-border relative hover:shadow-md transition-all">
          <div class="flex justify-between items-start">
            <div>
              <span class="text-[9px] uppercase font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-lg border border-primary/20">
                {{ log.kitab }}
              </span>
              <h4 class="font-bold text-text text-sm mt-2">{{ log.bab }}</h4>
            </div>
            <span class="text-xs text-text/40 font-medium">Penguji: {{ log.ustadz }}</span>
          </div>

          <p class="text-xs text-text/70 mt-3 italic bg-white p-3 rounded-xl border border-border/50">
            "{{ log.catatan }}"
          </p>

          <p class="text-[10px] text-text/50 mt-4">
            Santri: <span class="font-semibold text-text">{{ log.student_name }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showModal" class="fixed inset-0 bg-blue-950/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border animate-in zoom-in-95 duration-200">
        <div class="flex justify-between items-center border-b border-border pb-3 mb-4">
          <h3 class="font-extrabold text-lg text-text">
            Tambah Setoran {{ selectedTab === 'hafalan' ? 'Hafalan Baru' : 'Jurnal Sorogan' }}
          </h3>
          <button @click="showModal = false" class="text-text/50 hover:text-text">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Hafalan form -->
        <form v-if="selectedTab === 'hafalan'" @submit.prevent="submitHafalan" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Pilih Santri</label>
            <select v-model="formHafalan.student_id" class="input-modern" required>
              <option value="" disabled>-- Pilih Santri --</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Jenis Hafalan / Kitab</label>
              <input v-model="formHafalan.kitab" type="text" class="input-modern" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Status Kehafalan</label>
              <select v-model="formHafalan.status" class="input-modern">
                <option>Lancar</option>
                <option>Murojaah</option>
                <option>Taqrir</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Juz / Bait</label>
              <input v-model="formHafalan.juz" type="text" class="input-modern" placeholder="e.g. Juz 30 / Bait 1-50" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Surah / Bab</label>
              <input v-model="formHafalan.surah" type="text" class="input-modern" placeholder="e.g. An-Naba" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Tanggal</label>
            <input v-model="formHafalan.date" type="text" class="input-modern" required />
          </div>
          <button type="submit" class="w-full btn-primary mt-4 py-2 text-white bg-primary">Simpan Setoran</button>
        </form>

        <!-- Sorogan form -->
        <form v-else-if="selectedTab === 'sorogan'" @submit.prevent="submitSorogan" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Pilih Santri</label>
            <select v-model="formSorogan.student_id" class="input-modern" required>
              <option value="" disabled>-- Pilih Santri --</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Nama Kitab</label>
              <input v-model="formSorogan.kitab" type="text" class="input-modern" placeholder="e.g. Fathul Qorib" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Bab / Halaman</label>
              <input v-model="formSorogan.bab" type="text" class="input-modern" placeholder="e.g. Bab Shalat" required />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Catatan Ustadz</label>
            <textarea v-model="formSorogan.catatan" class="input-modern h-20 resize-none text-xs" placeholder="Catatan/fokus perbaikan bacaan..." required></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Nama Ustadz / Penguji</label>
            <input v-model="formSorogan.ustadz" type="text" class="input-modern" placeholder="e.g. K.H. Hasyim" required />
          </div>
          <button type="submit" class="w-full btn-primary mt-4 py-2 text-white bg-primary">Simpan Sorogan</button>
        </form>
      </div>
    </div>
  </div>
</template>

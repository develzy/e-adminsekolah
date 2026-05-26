<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2, X, CheckCircle } from 'lucide-vue-next'
import axios from 'axios'

// State
const academicYears = ref<any[]>([])
const classes = ref<any[]>([])
const teachers = ref<any[]>([])
const isLoading = ref(true)

// Modals
const ayModal = ref(false)
const classModal = ref(false)
const isEditing = ref(false)

const ayForm = ref({ id: '', name: '', semester: 'Ganjil', is_active: false })
const classForm = ref({ id: '', name: '', level: '10', academic_year_id: '', teacher_id: '' })

const fetchData = async () => {
  isLoading.value = true
  try {
    const [ayRes, classRes, teachersRes] = await Promise.all([
      axios.get('/api/academic-years'),
      axios.get('/api/classes'),
      axios.get('/api/teachers')
    ])
    academicYears.value = ayRes.data
    classes.value = classRes.data
    teachers.value = teachersRes.data
  } catch (error) {
    console.error('Error fetching academic data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())

// --- Academic Year Methods ---
const openAyModal = (ay?: any) => {
  if (ay) {
    isEditing.value = true
    ayForm.value = { ...ay, is_active: ay.is_active === 1 }
  } else {
    isEditing.value = false
    ayForm.value = { id: '', name: '', semester: 'Ganjil', is_active: false }
  }
  ayModal.value = true
}

const saveAy = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/academic-years/${ayForm.value.id}`, ayForm.value)
    } else {
      await axios.post('/api/academic-years', ayForm.value)
    }
    ayModal.value = false
    fetchData()
  } catch (error) {
    alert('Failed to save academic year')
  }
}

// --- Class Methods ---
const openClassModal = (cls?: any) => {
  if (cls) {
    isEditing.value = true
    classForm.value = { ...cls }
  } else {
    isEditing.value = false
    const activeAy = academicYears.value.find(a => a.is_active === 1)
    classForm.value = { id: '', name: '', level: '10', academic_year_id: activeAy ? activeAy.id : '', teacher_id: '' }
  }
  classModal.value = true
}

const saveClass = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/classes/${classForm.value.id}`, classForm.value)
    } else {
      await axios.post('/api/classes', classForm.value)
    }
    classModal.value = false
    fetchData()
  } catch (error) {
    alert('Failed to save class')
  }
}

const deleteClass = async (id: string) => {
  if (confirm('Delete this class?')) {
    await axios.delete(`/api/classes/${id}`)
    fetchData()
  }
}
</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-text">Data Akademik</h1>
        <p class="text-text/60 text-sm">Kelola Tahun Ajaran dan Ruang Kelas</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Academic Years Panel -->
      <div class="lg:col-span-1 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-text">Tahun Ajaran</h2>
          <button @click="openAyModal()" class="text-primary hover:text-primary/80 transition-colors bg-primary/10 p-2 rounded-lg">
            <Plus class="w-4 h-4" />
          </button>
        </div>
        
        <div class="card-modern p-4 space-y-3">
          <div v-if="isLoading" class="text-center py-4 text-text/50">Loading...</div>
          <div v-else-if="academicYears.length === 0" class="text-center py-4 text-text/50">Belum ada data</div>
          
          <div v-for="ay in academicYears" :key="ay.id" class="p-3 rounded-xl border flex items-center justify-between transition-colors" :class="ay.is_active ? 'border-primary bg-primary/5' : 'border-border bg-background'">
            <div>
              <p class="font-medium text-text">{{ ay.name }}</p>
              <p class="text-xs text-text/60">Semester {{ ay.semester }}</p>
            </div>
            <div class="flex items-center space-x-3">
              <CheckCircle v-if="ay.is_active" class="w-5 h-5 text-primary" />
              <button @click="openAyModal(ay)" class="text-text/40 hover:text-info transition-colors">
                <Edit class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Classes Panel -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-text">Ruang Kelas</h2>
          <button @click="openClassModal()" class="btn-primary flex items-center space-x-2 py-1.5 px-3 text-sm">
            <Plus class="w-4 h-4" />
            <span>Tambah Kelas</span>
          </button>
        </div>
        
        <div class="card-modern overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-background border-b border-border">
                <tr>
                  <th class="px-4 py-3 font-medium text-text/80 text-sm">Tingkat</th>
                  <th class="px-4 py-3 font-medium text-text/80 text-sm">Nama Kelas</th>
                  <th class="px-4 py-3 font-medium text-text/80 text-sm">Wali Kelas</th>
                  <th class="px-4 py-3 font-medium text-text/80 text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr v-if="isLoading">
                  <td colspan="4" class="text-center py-8">Loading...</td>
                </tr>
                <tr v-else-if="classes.length === 0">
                  <td colspan="4" class="text-center py-8 text-text/50">Belum ada data kelas.</td>
                </tr>
                <tr v-for="cls in classes" :key="cls.id" class="hover:bg-background/50 transition-colors">
                  <td class="px-4 py-4 text-sm text-text">Kelas {{ cls.level }}</td>
                  <td class="px-4 py-4 text-sm font-bold text-text">{{ cls.name }}</td>
                  <td class="px-4 py-4 text-sm text-text/80">{{ cls.teacher_name || '-' }}</td>
                  <td class="px-4 py-4 text-sm space-x-2">
                    <button @click="openClassModal(cls)" class="text-info hover:bg-info/10 p-1.5 rounded-lg transition-colors">
                      <Edit class="w-4 h-4" />
                    </button>
                    <button @click="deleteClass(cls.id)" class="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition-colors">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- AY Modal -->
    <div v-if="ayModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-surface w-full max-w-sm rounded-2xl p-6 shadow-xl relative border border-border">
        <button @click="ayModal = false" class="absolute right-4 top-4 text-text/50 hover:text-text"><X class="w-5 h-5" /></button>
        <h2 class="text-xl font-bold text-text mb-4">{{ isEditing ? 'Edit Tahun Ajaran' : 'Tahun Ajaran Baru' }}</h2>
        <form @submit.prevent="saveAy" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nama (contoh: 2026/2027)</label>
            <input v-model="ayForm.name" type="text" class="input-modern" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Semester</label>
            <select v-model="ayForm.semester" class="input-modern" required>
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
          <div class="flex items-center space-x-2 mt-4">
            <input type="checkbox" id="is_active" v-model="ayForm.is_active" class="rounded border-border text-primary focus:ring-primary w-4 h-4" />
            <label for="is_active" class="text-sm font-medium">Jadikan Tahun Ajaran Aktif</label>
          </div>
          <div class="pt-2 flex justify-end">
            <button type="submit" class="btn-primary py-2 px-6">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Class Modal -->
    <div v-if="classModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-surface w-full max-w-md rounded-2xl p-6 shadow-xl relative border border-border">
        <button @click="classModal = false" class="absolute right-4 top-4 text-text/50 hover:text-text"><X class="w-5 h-5" /></button>
        <h2 class="text-xl font-bold text-text mb-4">{{ isEditing ? 'Edit Kelas' : 'Tambah Kelas' }}</h2>
        <form @submit.prevent="saveClass" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Tingkat</label>
              <select v-model="classForm.level" class="input-modern" required>
                <optgroup label="Taman Kanak-kanak (TK)">
                  <option value="A">TK A</option>
                  <option value="B">TK B</option>
                </optgroup>
                <optgroup label="SD / MI">
                  <option value="1">Kelas 1</option>
                  <option value="2">Kelas 2</option>
                  <option value="3">Kelas 3</option>
                  <option value="4">Kelas 4</option>
                  <option value="5">Kelas 5</option>
                  <option value="6">Kelas 6</option>
                </optgroup>
                <optgroup label="SMP / MTs">
                  <option value="7">Kelas 7</option>
                  <option value="8">Kelas 8</option>
                  <option value="9">Kelas 9</option>
                </optgroup>
                <optgroup label="SMA / SMK / MA / Pesantren">
                  <option value="10">Kelas 10</option>
                  <option value="11">Kelas 11</option>
                  <option value="12">Kelas 12</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Nama Kelas</label>
              <input v-model="classForm.name" type="text" placeholder="IPA 1" class="input-modern" required />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Tahun Ajaran</label>
            <select v-model="classForm.academic_year_id" class="input-modern" required>
              <option value="" disabled>Pilih Tahun Ajaran</option>
              <option v-for="ay in academicYears" :key="ay.id" :value="ay.id">{{ ay.name }} ({{ ay.semester }})</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Wali Kelas</label>
            <select v-model="classForm.teacher_id" class="input-modern">
              <option value="">-- Tidak ada / Kosong --</option>
              <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.name }}</option>
            </select>
          </div>
          <div class="pt-2 flex justify-end">
            <button type="submit" class="btn-primary py-2 px-6">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

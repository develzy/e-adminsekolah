<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Save, FileSpreadsheet } from 'lucide-vue-next'
import axios from 'axios'

const selectedClass = ref('')
const selectedSubject = ref('')
const selectedType = ref('Sumatif')

const classes = ref<any[]>([])
const activeAcademicYear = ref<any>(null)
const students = ref<any[]>([])
const isSaving = ref(false)
const isLoading = ref(false)

// Fetch initial options
const fetchOptions = async () => {
  try {
    const [classRes, ayRes] = await Promise.all([
      axios.get('/api/classes'),
      axios.get('/api/academic-years')
    ])
    classes.value = classRes.data
    activeAcademicYear.value = ayRes.data.find((ay: any) => ay.is_active === 1)
  } catch (error) {
    console.error('Error fetching options', error)
  }
}

onMounted(() => fetchOptions())

const loadStudents = async () => {
  if (!selectedClass.value || !selectedSubject.value) {
    alert('Pilih Kelas dan Mata Pelajaran terlebih dahulu!')
    return
  }
  
  isLoading.value = true
  try {
    // For MVP: Fetch all students. In a full app, fetch only students in this class.
    const [studentsRes, gradesRes] = await Promise.all([
      axios.get('/api/students'),
      axios.get(`/api/grades?class_id=${selectedClass.value}&subject=${selectedSubject.value}`)
    ])
    
    // Map grades to students
    const gradesData = gradesRes.data
    students.value = studentsRes.data.map((student: any) => {
      const existingGrade = gradesData.find((g: any) => g.student_id === student.id && g.type === selectedType.value)
      return {
        ...student,
        score: existingGrade ? existingGrade.score : 0,
        feedback: existingGrade ? existingGrade.feedback : ''
      }
    })
  } catch (error) {
    console.error('Error loading students and grades', error)
    alert('Gagal memuat data siswa.')
  } finally {
    isLoading.value = false
  }
}

const saveGrades = async () => {
  if (students.value.length === 0) return alert('Tidak ada data nilai untuk disimpan.')
  if (!activeAcademicYear.value) return alert('Tidak ada Tahun Ajaran Aktif!')
  
  isSaving.value = true
  try {
    const payload = {
      school_id: 'default-school',
      academic_year_id: activeAcademicYear.value.id,
      class_id: selectedClass.value,
      subject: selectedSubject.value,
      grades: students.value.map(s => ({
        student_id: s.id,
        type: selectedType.value,
        score: Number(s.score),
        feedback: s.feedback || ''
      }))
    }
    
    await axios.post('/api/grades', payload)
    
    // Show success toast (using alert for MVP, or you can use your modern toast)
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-success text-white px-6 py-3 rounded-full shadow-lg z-[100] animate-in fade-in slide-in-from-top-10'
    toast.innerText = 'Nilai berhasil disimpan!'
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 3000)
    
  } catch (error) {
    console.error('Error saving grades', error)
    alert('Gagal menyimpan nilai.')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-text">Sistem Penilaian</h1>
        <p class="text-text/60 text-sm">Input nilai sumatif dan formatif siswa</p>
      </div>
      <button @click="saveGrades" :disabled="isSaving || students.length === 0" class="btn-primary flex items-center space-x-2 disabled:opacity-50">
        <Save class="w-5 h-5" />
        <span>{{ isSaving ? 'Menyimpan...' : 'Simpan Nilai' }}</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card-modern p-6 h-fit sticky top-24">
        <h3 class="font-bold text-lg mb-4 text-text">Filter Akademik</h3>
        
        <div v-if="!activeAcademicYear" class="p-3 bg-danger/10 text-danger rounded-lg text-sm mb-4">
          Belum ada Tahun Ajaran Aktif. Silakan atur di menu Akademik.
        </div>
        
        <div class="space-y-4" :class="{'opacity-50 pointer-events-none': !activeAcademicYear}">
          <div>
            <label class="block text-sm font-medium text-text mb-1">Kelas</label>
            <select v-model="selectedClass" class="input-modern">
              <option value="">Pilih Kelas...</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                Kelas {{ cls.level }} - {{ cls.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">Mata Pelajaran</label>
            <select v-model="selectedSubject" class="input-modern">
              <option value="">Pilih Mapel...</option>
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
              <option value="Sejarah">Sejarah</option>
              <option value="Fisika">Fisika</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">Jenis Penilaian</label>
            <select v-model="selectedType" class="input-modern">
              <option value="Sumatif">Penilaian Sumatif</option>
              <option value="Formatif">Penilaian Formatif</option>
              <option value="PTS">Penilaian Tengah Semester (PTS)</option>
              <option value="PAS">Penilaian Akhir Semester (PAS)</option>
            </select>
          </div>
          
          <button @click="loadStudents" class="w-full btn-primary bg-secondary text-white border-secondary hover:bg-secondary/90 flex items-center justify-center mt-4">
            <FileSpreadsheet class="w-5 h-5 mr-2" />
            Load Data Siswa
          </button>
        </div>
      </div>

      <div class="card-modern p-6 md:col-span-2">
        <div class="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-border pb-4 gap-4">
          <h3 class="font-bold text-lg text-text">Lembar Input Nilai</h3>
          <span v-if="selectedClass && students.length > 0" class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium whitespace-nowrap">
            {{ selectedSubject }} | {{ selectedType }}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-background">
              <tr>
                <th class="px-4 py-3 font-medium text-text/80 text-sm w-16">No</th>
                <th class="px-4 py-3 font-medium text-text/80 text-sm w-32">NIS</th>
                <th class="px-4 py-3 font-medium text-text/80 text-sm">Nama Lengkap</th>
                <th class="px-4 py-3 font-medium text-text/80 text-sm w-32 text-center">Nilai (0-100)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border relative">
              <tr v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-surface/80 z-10">
                <td colspan="4" class="py-12 font-medium text-primary animate-pulse">Memuat data...</td>
              </tr>
              <tr v-if="!isLoading && students.length === 0">
                <td colspan="4" class="text-center py-12 text-text/50">
                  Silakan pilih filter dan klik "Load Data Siswa"
                </td>
              </tr>
              <tr v-for="(student, index) in students" :key="student.id" class="hover:bg-background/50 transition-colors">
                <td class="px-4 py-3 text-sm text-text">{{ index + 1 }}</td>
                <td class="px-4 py-3 text-sm text-text/80">{{ student.nis }}</td>
                <td class="px-4 py-3 text-sm font-medium text-text">{{ student.name }}</td>
                <td class="px-4 py-3">
                  <input 
                    v-model="student.score" 
                    type="number" 
                    min="0" 
                    max="100" 
                    class="input-modern text-center font-bold"
                    :class="student.score < 75 && student.score > 0 ? 'text-danger focus:border-danger focus:ring-danger' : (student.score > 0 ? 'text-success focus:border-success focus:ring-success' : '')"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-if="students.length > 0" class="mt-4 flex items-center justify-between">
          <div class="flex items-center space-x-2 text-sm text-text/60">
            <div class="w-3 h-3 rounded-full bg-danger"></div>
            <span>&lt; 75 (Di bawah KKM)</span>
            <div class="w-3 h-3 rounded-full bg-success ml-4"></div>
            <span>&ge; 75 (Tuntas)</span>
          </div>
          <div class="text-sm font-medium text-text/80">
            Total Siswa: {{ students.length }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Printer, Download, FileText, Search } from 'lucide-vue-next'
import html2pdf from 'html2pdf.js'
import axios from 'axios'

const isGenerating = ref(false)
const isLoading = ref(false)

const classes = ref<any[]>([])
const selectedClass = ref('')
const students = ref<any[]>([])
const selectedStudentId = ref('')
const activeAcademicYear = ref<any>(null)
const grades = ref<any[]>([])

const fetchInitialData = async () => {
  try {
    const [classRes, ayRes] = await Promise.all([
      axios.get('/api/classes'),
      axios.get('/api/academic-years')
    ])
    classes.value = classRes.data
    activeAcademicYear.value = ayRes.data.find((ay: any) => ay.is_active === 1)
  } catch (error) {
    console.error('Error fetching classes', error)
  }
}

onMounted(() => fetchInitialData())

const loadStudents = async () => {
  if (!selectedClass.value) return
  isLoading.value = true
  try {
    const { data } = await axios.get('/api/students')
    // MVP: In a real app we'd filter by class_id. For now, assume all belong to the selected class for demo.
    students.value = data
    selectedStudentId.value = ''
    grades.value = []
  } catch (error) {
    console.error('Error loading students', error)
  } finally {
    isLoading.value = false
  }
}

const loadStudentData = async () => {
  if (!selectedStudentId.value || !selectedClass.value) return
  isLoading.value = true
  try {
    const { data } = await axios.get(`/api/grades?class_id=${selectedClass.value}`)
    // Filter grades just for this student
    grades.value = data.filter((g: any) => g.student_id === selectedStudentId.value)
  } catch (error) {
    console.error('Error loading grades', error)
  } finally {
    isLoading.value = false
  }
}

const selectedStudent = computed(() => {
  return students.value.find(s => s.id === selectedStudentId.value)
})

const selectedClassData = computed(() => {
  return classes.value.find(c => c.id === selectedClass.value)
})

const exportPDF = () => {
  if (!selectedStudent.value) return alert('Pilih siswa terlebih dahulu!')
  
  isGenerating.value = true
  const element = document.getElementById('raport-content')
  
  const opt = {
    margin:       0,
    filename:     `Raport_${selectedStudent.value.name}.pdf`,
    image:        { type: 'jpeg' as const, quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'in', format: [8.5, 13] as [number, number], orientation: 'portrait' as const }
  }

  if (element) {
    html2pdf().set(opt).from(element as HTMLElement).save().then(() => {
      isGenerating.value = false
    })
  } else {
    isGenerating.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-text">Raport Digital</h1>
        <p class="text-text/60 text-sm">Cetak raport siswa ke dalam format PDF (Kertas F4/Folio)</p>
      </div>
      <button 
        @click="exportPDF" 
        :disabled="isGenerating || !selectedStudent"
        class="btn-primary flex items-center space-x-2 disabled:opacity-50"
      >
        <Printer v-if="!isGenerating" class="w-5 h-5" />
        <Download v-else class="w-5 h-5 animate-bounce" />
        <span>{{ isGenerating ? 'Mencetak PDF...' : 'Cetak Raport F4' }}</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Filter Sidebar -->
      <div class="card-modern p-6 h-fit md:col-span-1 space-y-4 sticky top-24">
        <h3 class="font-bold text-lg text-text">Pengaturan Cetak</h3>
        
        <div>
          <label class="block text-sm font-medium text-text mb-1">Pilih Kelas</label>
          <div class="flex space-x-2">
            <select v-model="selectedClass" class="input-modern w-full">
              <option value="">-- Pilih Kelas --</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                Kelas {{ cls.level }} - {{ cls.name }}
              </option>
            </select>
            <button @click="loadStudents" class="btn-primary p-2" title="Load Siswa">
              <Search class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div :class="{'opacity-50 pointer-events-none': students.length === 0}">
          <label class="block text-sm font-medium text-text mb-1">Pilih Siswa</label>
          <select v-model="selectedStudentId" @change="loadStudentData" class="input-modern w-full">
            <option value="">-- Pilih Siswa --</option>
            <option v-for="s in students" :key="s.id" :value="s.id">
              {{ s.nis }} - {{ s.name }}
            </option>
          </select>
        </div>
        
        <div class="p-4 bg-primary/5 rounded-lg border border-primary/20 flex flex-col items-center text-center mt-6">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-border">
            <FileText class="w-8 h-8 text-primary" />
          </div>
          <h4 class="font-bold text-text">Data Real-time</h4>
          <p class="text-xs text-text/60 mt-1">Raport ini terhubung langsung dengan database nilai guru.</p>
        </div>
      </div>

      <!-- PDF Preview Area -->
      <div class="md:col-span-3 bg-gray-200 p-8 rounded-2xl overflow-x-auto flex justify-center">
        <div v-if="!selectedStudent" class="flex flex-col items-center justify-center text-gray-500 py-20 w-[8.5in] h-[13in] bg-white shadow-2xl shrink-0">
          <FileText class="w-16 h-16 mb-4 opacity-50" />
          <p class="font-medium">Silakan pilih kelas dan siswa untuk memuat tampilan raport.</p>
        </div>
        
        <!-- Actual Report Card to Print -->
        <div v-else id="raport-content" class="bg-white p-8 shadow-2xl w-[8.5in] h-[13in] text-black shrink-0 relative flex flex-col justify-between box-border">
          <!-- Top Content Wrapper -->
          <div class="space-y-4">
            <!-- Header -->
            <div class="border-b-2 border-black pb-2 flex justify-between items-end text-xs">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-800 border border-blue-800 text-[10px]">
                  LOGO
                </div>
                <div>
                  <h1 class="text-sm font-bold uppercase">Laporan Hasil Belajar (Raport)</h1>
                  <h2 class="text-xs font-bold">{{ selectedStudent?.school_name || 'E-Admin Sekolah SaaS' }}</h2>
                  <p class="text-[10px]">Sistem Informasi Raport Digital Terintegrasi</p>
                </div>
              </div>
              <div class="text-right text-[10px] leading-tight">
                <p><strong>NPSN:</strong> 20101111</p>
                <p><strong>Fase/Kelas:</strong> E / {{ selectedClassData?.name || '-' }}</p>
                <p><strong>Semester:</strong> {{ activeAcademicYear?.semester || 'Ganjil' }}</p>
                <p><strong>Tahun Pelajaran:</strong> {{ activeAcademicYear?.name || '-' }}</p>
              </div>
            </div>

            <!-- Student Info -->
            <div class="grid grid-cols-2 gap-4 text-xs border-b border-gray-300 pb-2">
              <div>
                <table class="w-full">
                  <tbody>
                    <tr><td class="py-0.5 w-32">Nama Peserta Didik</td><td class="py-0.5 px-1">:</td><td class="py-0.5 font-bold">{{ selectedStudent.name }}</td></tr>
                    <tr><td class="py-0.5">NISN / NIS</td><td class="py-0.5 px-1">:</td><td class="py-0.5">{{ selectedStudent.nisn || '-' }} / {{ selectedStudent.nis || '-' }}</td></tr>
                  </tbody>
                </table>
              </div>
              <div>
                <table class="w-full">
                  <tbody>
                    <tr><td class="py-0.5 w-24">Wali Kelas</td><td class="py-0.5 px-1">:</td><td class="py-0.5">{{ selectedClassData?.teacher_name || 'Drs. Mulyono' }}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Grades Table -->
            <div>
              <h3 class="font-bold text-xs mb-1">A. NILAI AKADEMIK</h3>
              <table class="w-full border-collapse border border-black text-xs">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-black p-1 w-8 text-center">No</th>
                    <th class="border border-black p-1">Mata Pelajaran</th>
                    <th class="border border-black p-1 w-16 text-center">Nilai Akhir</th>
                    <th class="border border-black p-1">Capaian Kompetensi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="bg-gray-50/50">
                    <td class="border border-black px-2 py-0.5 text-center font-bold" colspan="4">Kelompok Mata Pelajaran Umum</td>
                  </tr>
                  <tr v-if="grades.length === 0">
                    <td colspan="4" class="border border-black px-2 py-4 text-center text-gray-500">Belum ada data nilai untuk siswa ini di kelas ini.</td>
                  </tr>
                  <tr v-for="(grade, index) in grades" :key="grade.id">
                    <td class="border border-black px-2 py-0.5 text-center">{{ index + 1 }}</td>
                    <td class="border border-black px-2 py-0.5">{{ grade.subject }}</td>
                    <td class="border border-black px-2 py-0.5 text-center font-bold" :class="grade.score < 75 ? 'text-red-600' : ''">{{ grade.score }}</td>
                    <td class="border border-black px-2 py-0.5 text-[10px]">{{ grade.feedback || (grade.score >= 75 ? 'Menunjukkan penguasaan yang sangat baik.' : 'Perlu pendampingan lebih lanjut dalam memahami materi.') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Ekstrakurikuler & Attendance side-by-side to save space -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Ekstrakurikuler -->
              <div>
                <h3 class="font-bold text-xs mb-1">B. EKSTRAKURIKULER</h3>
                <table class="w-full border-collapse border border-black text-xs">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="border border-black p-1 w-8 text-center">No</th>
                      <th class="border border-black p-1">Kegiatan Ekstrakurikuler</th>
                      <th class="border border-black p-1">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border border-black px-2 py-1 text-center">1</td>
                      <td class="border border-black px-2 py-1 font-medium">Pramuka (Wajib)</td>
                      <td class="border border-black px-2 py-1 text-[10px]">Sangat Baik, aktif dalam kegiatan.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Attendance -->
              <div>
                <h3 class="font-bold text-xs mb-1">C. KETIDAKHADIRAN</h3>
                <table class="w-full border-collapse border border-black text-xs">
                  <tbody>
                    <tr><td class="border border-black px-3 py-1 w-32">Sakit</td><td class="border border-black px-3 py-1 text-center">0 Hari</td></tr>
                    <tr><td class="border border-black px-3 py-1">Izin</td><td class="border border-black px-3 py-1 text-center">0 Hari</td></tr>
                    <tr><td class="border border-black px-3 py-1">Tanpa Keterangan</td><td class="border border-black px-3 py-1 text-center">0 Hari</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Bottom Signatures Wrapper -->
          <div class="space-y-4">
            <!-- Signatures Side-by-Side (Orang Tua & Wali Kelas) -->
            <div class="flex justify-between text-xs">
              <div class="text-center w-48">
                <p class="mb-12">Orang Tua / Wali,</p>
                <p class="font-bold border-b border-black inline-block px-4">...................................</p>
              </div>
              <div class="text-center w-48">
                <p class="mb-1">Jakarta, 15 Desember 2026</p>
                <p class="mb-12">Wali Kelas,</p>
                <p class="font-bold border-b border-black inline-block px-4">{{ selectedClassData?.teacher_name || 'Drs. Mulyono' }}</p>
                <p class="text-[10px] text-gray-600">NIP. -</p>
              </div>
            </div>
            
            <!-- Kepala Sekolah Signature (Centered at the very bottom) -->
            <div class="text-center text-xs pt-2">
              <p class="mb-12">Mengetahui,<br>Kepala Sekolah,</p>
              <p class="font-bold border-b border-black inline-block px-4">H. Ahmad Dahlan, M.Pd.</p>
              <p class="text-[10px] text-gray-600">NIP. 19650215 199003 1 005</p>
            </div>
          </div>

          <!-- Watermark -->
          <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
            <h1 class="text-9xl font-bold transform -rotate-45 text-black">ASLI</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

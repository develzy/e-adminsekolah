<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { 
  BrainCircuit, Sparkles, Loader2, Copy, Check, Info, BookOpen, 
  HelpCircle, ClipboardList, PenTool, Flame, Star
} from 'lucide-vue-next'

const currentTab = ref('soal') // 'soal' | 'lkpd' | 'bahan_ajar' | 'modul_ajar' | 'pesantren_hafalan'

const classes = ref<any[]>([])
const selectedClass = ref('')
const isLoadingInitial = ref(false)

const subjects = ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Sejarah', 'Fisika', 'Pendidikan Agama Islam', 'Bahasa Arab']

const standardMateri: Record<string, string[]> = {
  'Matematika': ['Sistem Persamaan Linear', 'Fungsi Kuadrat', 'Trigonometri', 'Statistika', 'Peluang'],
  'Bahasa Indonesia': ['Teks Laporan Hasil Observasi', 'Teks Anekdot', 'Teks Hikayat', 'Teks Negosiasi'],
  'Bahasa Inggris': ['Descriptive Text', 'Narrative Text', 'Procedure Text', 'Analytical Exposition'],
  'Sejarah': ['Proklamasi Kemerdekaan', 'Pendudukan Jepang', 'Sumpah Pemuda', 'Kerajaan Hindu-Buddha'],
  'Fisika': ['Pengukuran dan Vektor', 'Gerak Lurus', 'Hukum Newton', 'Energi Terbarukan'],
  'Pendidikan Agama Islam': ['Hukum Tajwid', 'Kisah Nabi Muhammad SAW', 'Ushul Fiqh', 'Akhlakul Karimah'],
  'Bahasa Arab': ['Percakapan Sehari-hari (Hiwar)', 'Tashrif Tsulasi', 'Nahwu & Shorof Dasar']
}

const form = ref({
  jenjang: 'SMA/SMK/MA',
  mapel: 'Sejarah',
  fase: 'E',
  materi: '',
  level: 'HOTS',
  jumlahPg: 5,
  jumlahIsian: 0,
  jumlahEssay: 0,
  extraPrompt: ''
})

const customMateriList = ref<string[]>([])
const useManualMateri = ref(false)
const manualMateri = ref('')

const materiOptions = computed(() => {
  const std = standardMateri[form.value.mapel] || []
  return [...new Set([...std, ...customMateriList.value])]
})

// Determine jenjang & fase from class level
watch(selectedClass, (newClassId) => {
  if (!newClassId) return
  const cls = classes.value.find(c => c.id === newClassId)
  if (cls) {
    const lvl = String(cls.level)
    if (lvl === 'A' || lvl === 'B' || lvl === 'TK') {
      form.value.fase = 'Fondasi'
      form.value.jenjang = 'TK/RA'
    } else if (['1', '2'].includes(lvl)) {
      form.value.fase = 'A'
      form.value.jenjang = 'SD/MI'
    } else if (['3', '4'].includes(lvl)) {
      form.value.fase = 'B'
      form.value.jenjang = 'SD/MI'
    } else if (['5', '6'].includes(lvl)) {
      form.value.fase = 'C'
      form.value.jenjang = 'SD/MI'
    } else if (['7', '8', '9'].includes(lvl)) {
      form.value.fase = 'D'
      form.value.jenjang = 'SMP/MTs'
    } else if (lvl === '10') {
      form.value.fase = 'E'
      form.value.jenjang = 'SMA/SMK/MA'
    } else if (['11', '12'].includes(lvl)) {
      form.value.fase = 'F'
      form.value.jenjang = 'SMA/SMK/MA'
    } else {
      form.value.fase = 'F'
      form.value.jenjang = 'Pondok Pesantren'
    }
    loadCustomMateri()
  }
})

watch(() => form.value.mapel, () => {
  form.value.materi = ''
  loadCustomMateri()
})

const loadCustomMateri = async () => {
  if (!selectedClass.value || !form.value.mapel) return
  try {
    const { data } = await axios.get(`/api/grades?class_id=${selectedClass.value}&subject=${form.value.mapel}`)
    const feedbacks = data
      .map((g: any) => g.feedback)
      .filter((f: any) => f && f.trim().length > 0)
    customMateriList.value = feedbacks
  } catch (error) {
    console.error('Error fetching custom CP/materi:', error)
  }
}

const fetchInitialData = async () => {
  isLoadingInitial.value = true
  try {
    const { data } = await axios.get('/api/classes')
    classes.value = data
    if (data.length > 0) {
      selectedClass.value = data[0].id
    }
  } catch (error) {
    console.error('Error loading classes:', error)
  } finally {
    isLoadingInitial.value = false
  }
}

onMounted(() => {
  fetchInitialData()
})

const isLoading = ref(false)
const result = ref<any>(null)
const copied = ref(false)

const generateAI = async () => {
  const finalMateri = useManualMateri.value ? manualMateri.value : form.value.materi
  if (!finalMateri && currentTab.value !== 'pesantren_hafalan') {
    alert('Pilih atau ketik materi terlebih dahulu!')
    return
  }

  isLoading.value = true
  result.value = null
  
  try {
    const payload = {
      type: currentTab.value,
      ...form.value,
      materi: currentTab.value === 'pesantren_hafalan' ? form.value.extraPrompt : finalMateri
    }

    const response = await axios.post('/api/ai/generate-erp', payload)
    if (response.data.status === 'success') {
      result.value = response.data.data
    } else {
      throw new Error(response.data.message || 'Gagal generate konten AI')
    }
  } catch (error: any) {
    console.error('AI Error:', error)
    alert('Terjadi kesalahan saat menghubungi AI: ' + (error.response?.data?.message || error.message))
  } finally {
    isLoading.value = false
  }
}

const copyResult = () => {
  navigator.clipboard.writeText(JSON.stringify(result.value, null, 2))
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5">
      <div>
        <h1 class="text-3xl font-extrabold text-text flex items-center tracking-tight">
          <BrainCircuit class="w-8 h-8 mr-3 text-primary" />
          AI Education ERP Suite
        </h1>
        <p class="text-text/60 text-sm mt-1">Gunakan model Gemini 1.5 Flash untuk mempermudah administrasi guru, penyusunan LKPD, modul ajar, bank soal, dan program hafalan pesantren.</p>
      </div>
      <div class="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-400/30 px-4 py-2.5 rounded-2xl shadow-sm">
        <Star class="w-5 h-5 text-yellow-500 fill-current animate-pulse" />
        <span class="text-xs font-semibold text-yellow-600">Premium White-Blue-Gold Theme</span>
      </div>
    </div>

    <!-- Tab switcher -->
    <div class="flex flex-wrap gap-2 border-b border-border pb-3">
      <button 
        v-for="tab in [
          { id: 'soal', label: '📝 Bank Soal AI', desc: 'PG, Isian, & Essay' },
          { id: 'lkpd', label: '📋 LKPD AI', desc: 'Lembar Aktivitas Siswa' },
          { id: 'bahan_ajar', label: '📖 Bahan Ajar AI', desc: 'Ringkasan & Latihan' },
          { id: 'modul_ajar', label: '🧩 Modul Ajar AI', desc: 'Kurikulum Merdeka' },
          { id: 'pesantren_hafalan', label: '🕌 Hafalan Pesantren', desc: 'Kitab & Al-Qur\'an' }
        ]" 
        :key="tab.id"
        @click="currentTab = tab.id; result = null"
        :class="[
          'px-5 py-3 rounded-2xl transition-all duration-300 text-left border flex flex-col',
          currentTab === tab.id 
            ? 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white border-blue-900 shadow-lg scale-[1.02]' 
            : 'bg-surface text-text/80 hover:bg-background/80 border-border hover:border-blue-300'
        ]"
      >
        <span class="font-bold text-sm">{{ tab.label }}</span>
        <span class="text-[10px] mt-0.5" :class="currentTab === tab.id ? 'text-yellow-400/80 font-medium' : 'text-text/50'">{{ tab.desc }}</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Input Panel -->
      <div class="card-modern p-6 lg:col-span-1 h-fit space-y-4 border-t-4 border-t-yellow-500">
        <div class="flex items-center justify-between border-b border-border pb-3">
          <h3 class="font-bold text-lg text-text">Konfigurasi Modul</h3>
          <span class="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {{ currentTab }}
          </span>
        </div>
        
        <form @submit.prevent="generateAI" class="space-y-4">
          <!-- Pilih Kelas (Semua tab kecuali Pesantren) -->
          <div v-if="currentTab !== 'pesantren_hafalan'">
            <label class="block text-sm font-medium text-text mb-1">Pilih Kelas</label>
            <select v-model="selectedClass" class="input-modern" required>
              <option value="" disabled>-- Pilih Kelas --</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                Kelas {{ cls.level }} - {{ cls.name }}
              </option>
            </select>
          </div>

          <!-- Mata Pelajaran -->
          <div v-if="currentTab !== 'pesantren_hafalan'">
            <label class="block text-sm font-medium text-text mb-1">Mata Pelajaran</label>
            <select v-model="form.mapel" class="input-modern" required>
              <option v-for="sub in subjects" :key="sub" :value="sub">{{ sub }}</option>
            </select>
          </div>

          <!-- Materi / CP -->
          <div v-if="currentTab !== 'pesantren_hafalan'">
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm font-medium text-text">Materi / CP Pembelajaran</label>
              <div class="flex items-center space-x-1">
                <input type="checkbox" id="manual-mode" v-model="useManualMateri" class="rounded text-primary w-3.5 h-3.5" />
                <label for="manual-mode" class="text-xs text-text/60 cursor-pointer">Ketik Manual</label>
              </div>
            </div>

            <div v-if="!useManualMateri">
              <select v-model="form.materi" class="input-modern" required>
                <option value="" disabled>-- Pilih Materi / CP --</option>
                <option v-for="opt in materiOptions" :key="opt" :value="opt">{{ opt }}</option>
              </select>
              <p class="text-[10px] text-text/50 mt-1 flex items-center">
                <Info class="w-3 h-3 mr-1 inline-block" /> Materi ditarik otomatis dari database.
              </p>
            </div>
            
            <div v-else>
              <textarea 
                v-model="manualMateri" 
                class="input-modern h-20 resize-none text-xs" 
                placeholder="Contoh: Memahami peradaban besar dunia dan pengaruhnya di Indonesia."
                required
              ></textarea>
            </div>
          </div>

          <!-- Modul Khusus Pesantren -->
          <div v-if="currentTab === 'pesantren_hafalan'" class="space-y-4 animate-in fade-in duration-300">
            <div>
              <label class="block text-sm font-medium text-text mb-1">Nama Kitab / Surah Al-Qur'an</label>
              <input 
                v-model="form.extraPrompt" 
                type="text" 
                class="input-modern" 
                placeholder="Contoh: Kitab Fathul Qorib - Bab Shalat atau Surah Al-Kahfi"
                required
              />
            </div>
          </div>

          <!-- Parameters (For Soal) -->
          <div v-if="currentTab === 'soal'" class="space-y-4 animate-in fade-in duration-300">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-text mb-1">Level Kognitif</label>
                <select v-model="form.level" class="input-modern">
                  <option>LOTS</option>
                  <option>MOTS</option>
                  <option>HOTS</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-text mb-1">Fase / Fase Kelas</label>
                <div class="input-modern bg-background text-text/60 flex items-center justify-center font-bold">
                  Fase {{ form.fase }}
                </div>
              </div>
            </div>

            <!-- Jumlah Soal Breakdown -->
            <div class="border-t border-border pt-4">
              <label class="block text-sm font-semibold text-text mb-2">Jumlah Butir Soal</label>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-[10px] text-text/60 mb-0.5 text-center">PG</label>
                  <input v-model.number="form.jumlahPg" type="number" min="0" max="15" class="input-modern text-center font-bold" required />
                </div>
                <div>
                  <label class="block text-[10px] text-text/60 mb-0.5 text-center">Isian</label>
                  <input v-model.number="form.jumlahIsian" type="number" min="0" max="15" class="input-modern text-center font-bold" required />
                </div>
                <div>
                  <label class="block text-[10px] text-text/60 mb-0.5 text-center">Essay</label>
                  <input v-model.number="form.jumlahEssay" type="number" min="0" max="15" class="input-modern text-center font-bold" required />
                </div>
              </div>
            </div>
          </div>

          <!-- Dynamic Info based on dynamic level/jenjang -->
          <div v-if="currentTab !== 'pesantren_hafalan'" class="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-800 space-y-1">
            <p><strong>Deteksi Jenjang:</strong> {{ form.jenjang }}</p>
            <p><strong>Deteksi Kurikulum:</strong> Kurikulum Merdeka (Fase {{ form.fase }})</p>
          </div>
          
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full btn-primary flex items-center justify-center mt-4 text-sm py-3 bg-gradient-to-r from-blue-900 to-blue-800 border-none text-white hover:from-blue-800 hover:to-blue-700 shadow-md font-bold"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 mr-2 animate-spin text-white" />
            <Sparkles v-else class="w-5 h-5 mr-2 text-yellow-400 fill-current" />
            {{ isLoading ? 'Memproses Konten AI...' : 'Generate Konten Sekarang' }}
          </button>
        </form>
      </div>

      <!-- Result Panel -->
      <div class="card-modern p-6 lg:col-span-2 min-h-[500px] flex flex-col relative border border-border">
        <!-- Empty State -->
        <div v-if="!result && !isLoading" class="flex-1 flex flex-col items-center justify-center text-text/40">
          <BrainCircuit class="w-20 h-20 mb-4 opacity-10 text-blue-900" />
          <h4 class="font-bold text-text/80 text-sm">AI Workspace Siap Digunakan</h4>
          <p class="text-xs text-text/50 max-w-sm text-center mt-1">Pilih tab jenis berkas administrasi di atas, atur konfigurasi materi, lalu klik tombol Generate Konten.</p>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex-1 flex flex-col items-center justify-center">
          <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse mb-4 relative">
            <div class="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping"></div>
            <Sparkles class="w-10 h-10 text-primary animate-spin" style="animation-duration: 4s;" />
          </div>
          <p class="text-text/70 font-semibold animate-pulse">Gemini 1.5 Flash sedang menyusun administrasi kurikulum...</p>
          <p class="text-[11px] text-text/40 mt-1">Menggunakan parameter nasional Kurikulum Merdeka & Pesantren.</p>
        </div>

        <!-- Result View -->
        <div v-if="result" class="space-y-6">
          <div class="flex justify-between items-center border-b border-border pb-4">
            <div>
              <h3 class="font-extrabold text-lg text-text">Workspace Konten AI</h3>
              <p class="text-xs text-text/50 mt-0.5">Berhasil di-generate via Gemini API dengan tema Putih-Biru-Emas</p>
            </div>
            <button @click="copyResult" class="flex items-center space-x-1.5 text-xs text-primary hover:text-white border border-primary/30 hover:bg-primary px-3 py-2 rounded-xl transition-all font-semibold">
              <Check v-if="copied" class="w-4 h-4 text-success" />
              <Copy v-else class="w-4 h-4" />
              <span>{{ copied ? 'Tersalin!' : 'Salin JSON' }}</span>
            </button>
          </div>

          <!-- Tab-specific Result Rendering -->

          <!-- 1. BANK SOAL & KISI-KISI -->
          <div v-if="currentTab === 'soal' && Array.isArray(result)" class="space-y-6">
            <div v-for="(soal, index) in result" :key="index" class="bg-background rounded-2xl p-5 border border-border space-y-3 relative hover:shadow-md transition-all">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider"
                  :class="{
                    'bg-blue-100 text-blue-900 border border-blue-200': soal.tipe === 'pilihan_ganda',
                    'bg-emerald-100 text-emerald-900 border border-emerald-200': soal.tipe === 'isian',
                    'bg-purple-100 text-purple-900 border border-purple-200': soal.tipe === 'essay'
                  }"
                >
                  {{ soal.tipe === 'pilihan_ganda' ? 'Pilihan Ganda' : (soal.tipe === 'isian' ? 'Isian Singkat' : 'Essay') }}
                </span>
                <span class="text-xs text-text/40 font-semibold">Soal #{{ index + 1 }}</span>
              </div>

              <p class="font-bold text-text leading-relaxed"><span class="text-primary font-extrabold mr-1">{{ index + 1 }}.</span> {{ soal.pertanyaan }}</p>
              
              <div v-if="soal.tipe === 'pilihan_ganda' && soal.pilihan" class="grid grid-cols-1 md:grid-cols-2 gap-2 pl-5 mt-2">
                <p v-for="pil in soal.pilihan" :key="pil" class="text-xs text-text/80 bg-surface/50 p-2 rounded-xl border border-border/40 hover:border-blue-300 cursor-pointer transition-colors">{{ pil }}</p>
              </div>

              <div class="bg-surface/80 p-4 rounded-xl border border-border text-xs space-y-2 mt-4">
                <p class="font-bold text-success flex items-center">
                  <CheckCircle class="w-4 h-4 mr-1 inline-block" /> Kunci / Acuan Jawaban: {{ soal.jawaban_benar }}
                </p>
                <p class="text-text/70 leading-relaxed"><span class="font-bold text-text">Pembahasan:</span> {{ soal.pembahasan }}</p>
              </div>
            </div>
          </div>

          <!-- 2. LKPD AI -->
          <div v-else-if="currentTab === 'lkpd'" class="space-y-4 text-text/80 text-sm">
            <div class="bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-2xl p-6 shadow-md border-b-4 border-b-yellow-500">
              <h2 class="text-xl font-bold text-yellow-400 flex items-center">
                <ClipboardList class="w-6 h-6 mr-2" /> {{ result.judul || 'Lembar Kerja Peserta Didik' }}
              </h2>
              <p class="text-xs text-white/70 mt-1">Jenjang: {{ form.jenjang }} | Mapel: {{ form.mapel }} | Kelas: {{ form.fase }}</p>
            </div>

            <div class="card-modern p-5 space-y-4">
              <div>
                <h4 class="font-bold text-primary flex items-center"><HelpCircle class="w-4 h-4 mr-1.5" /> Tujuan Pembelajaran</h4>
                <ul class="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li v-for="t in result.tujuan" :key="t">{{ t }}</li>
                </ul>
              </div>

              <div class="border-t border-border pt-3">
                <h4 class="font-bold text-primary flex items-center"><PenTool class="w-4 h-4 mr-1.5" /> Aktivitas Siswa</h4>
                <p class="text-xs mt-1 leading-relaxed">{{ result.aktivitas }}</p>
              </div>

              <div class="border-t border-border pt-3">
                <h4 class="font-bold text-primary flex items-center"><Flame class="w-4 h-4 mr-1.5" /> Langkah Kerja</h4>
                <ol class="list-decimal pl-5 mt-1 space-y-1 text-xs leading-relaxed">
                  <li v-for="lk in result.langkah_kerja" :key="lk">{{ lk }}</li>
                </ol>
              </div>

              <div class="border-t border-border pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-yellow-50/50 border border-yellow-200/50 p-3 rounded-xl text-xs">
                  <h5 class="font-bold text-yellow-800">Refleksi Siswa</h5>
                  <p class="mt-1 text-yellow-900/80 leading-relaxed">{{ result.refleksi }}</p>
                </div>
                <div class="bg-blue-50/50 border border-blue-200/50 p-3 rounded-xl text-xs">
                  <h5 class="font-bold text-blue-800">Petunjuk Guru</h5>
                  <p class="mt-1 text-blue-900/80 leading-relaxed">{{ result.petunjuk_guru }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. BAHAN AJAR AI -->
          <div v-else-if="currentTab === 'bahan_ajar'" class="space-y-4 text-text/80 text-sm">
            <div class="bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-2xl p-6 border-b-4 border-b-yellow-500 shadow-md">
              <h2 class="text-xl font-bold text-yellow-400 flex items-center">
                <BookOpen class="w-6 h-6 mr-2" /> {{ result.judul || 'Materi Bahan Ajar' }}
              </h2>
              <p class="text-xs text-white/70 mt-1">Dibuat Otomatis dengan Pendekatan Komprehensif</p>
            </div>

            <div class="card-modern p-5 space-y-4">
              <div>
                <h4 class="font-bold text-primary">📚 Ringkasan Materi</h4>
                <p class="text-xs mt-1 leading-relaxed bg-surface p-3 rounded-xl border border-border/60">{{ result.ringkasan }}</p>
              </div>

              <div class="border-t border-border pt-4">
                <h4 class="font-bold text-primary">📝 Materi Lengkap</h4>
                <p class="text-xs mt-1 leading-relaxed whitespace-pre-line">{{ result.materi_lengkap }}</p>
              </div>

              <div v-if="result.contoh_soal && result.contoh_soal.length > 0" class="border-t border-border pt-4">
                <h4 class="font-bold text-primary">💡 Contoh Soal</h4>
                <ul class="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li v-for="cs in result.contoh_soal" :key="cs">{{ cs }}</li>
                </ul>
              </div>

              <div v-if="result.latihan_soal && result.latihan_soal.length > 0" class="border-t border-border pt-4">
                <h4 class="font-bold text-primary">✏️ Latihan Mandiri</h4>
                <ul class="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li v-for="ls in result.latihan_soal" :key="ls">{{ ls }}</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 4. MODUL AJAR AI -->
          <div v-else-if="currentTab === 'modul_ajar'" class="space-y-4 text-text/80 text-sm">
            <div class="bg-gradient-to-r from-blue-900 to-blue-950 text-white rounded-2xl p-6 border-b-4 border-b-yellow-500 shadow-md">
              <h2 class="text-xl font-bold text-yellow-400 flex items-center">
                <ClipboardList class="w-6 h-6 mr-2" /> Rencana Modul Ajar Kurikulum Merdeka
              </h2>
              <p class="text-xs text-white/70 mt-1">Fokus Ajar: {{ form.mapel }} - Fase {{ form.fase }}</p>
            </div>

            <div class="card-modern p-5 space-y-4">
              <div>
                <h4 class="font-bold text-primary">🏫 Identitas Umum Modul</h4>
                <p class="text-xs mt-1 leading-relaxed bg-surface p-3 rounded-xl border border-border/60">{{ result.identitas_umum }}</p>
              </div>

              <div class="border-t border-border pt-3">
                <h4 class="font-bold text-primary">🎯 Tujuan Pembelajaran (TP)</h4>
                <ul class="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li v-for="tp in result.tujuan_pembelajaran" :key="tp">{{ tp }}</li>
                </ul>
              </div>

              <div class="border-t border-border pt-3">
                <h4 class="font-bold text-primary">👣 Langkah-Langkah Pembelajaran</h4>
                <ol class="list-decimal pl-5 mt-1 space-y-1 text-xs leading-relaxed">
                  <li v-for="lp in result.langkah_pembelajaran" :key="lp">{{ lp }}</li>
                </ol>
              </div>

              <div class="border-t border-border pt-3 grid grid-cols-2 gap-4">
                <div>
                  <h4 class="font-bold text-primary text-xs">📊 Asesmen Modul</h4>
                  <p class="text-[11px] mt-1 leading-relaxed text-text/70">{{ result.asesmen }}</p>
                </div>
                <div>
                  <h4 class="font-bold text-primary text-xs">🛠️ Media & Sumber Belajar</h4>
                  <ul class="list-disc pl-4 mt-1 text-[11px] text-text/70 space-y-1">
                    <li v-for="m in result.media_pembelajaran" :key="m">{{ m }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. HAFALAN PESANTREN -->
          <div v-else-if="currentTab === 'pesantren_hafalan'" class="space-y-4 text-text/80 text-sm">
            <div class="bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 text-white rounded-2xl p-6 border-b-4 border-b-yellow-500 shadow-md">
              <h2 class="text-xl font-bold text-yellow-400 flex items-center">
                🕌 Rencana Program Hafalan Kitab & Qur'an
              </h2>
              <p class="text-xs text-white/70 mt-1">Kitab/Fokus: {{ result.kitab || form.extraPrompt }}</p>
            </div>

            <div class="card-modern p-5 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-surface p-3 rounded-xl border border-border/60">
                  <span class="text-[10px] uppercase font-bold text-text/40">Target Harian / Bab</span>
                  <p class="font-bold text-primary text-xs mt-0.5">{{ result.bab_pasal || 'Bab Kitab' }}</p>
                </div>
                <div class="bg-surface p-3 rounded-xl border border-border/60">
                  <span class="text-[10px] uppercase font-bold text-text/40">Metode Setoran</span>
                  <p class="font-bold text-primary text-xs mt-0.5">{{ result.metode_setoran || 'Sorogan / Bandongan' }}</p>
                </div>
              </div>

              <div class="border-t border-border pt-4">
                <h4 class="font-bold text-primary">📖 Target Hafalan & Tafsir</h4>
                <p class="text-xs mt-1 leading-relaxed bg-surface p-3 rounded-xl border border-border/60">{{ result.target_hafalan }}</p>
              </div>

              <div v-if="result.tips_hafalan && result.tips_hafalan.length > 0" class="border-t border-border pt-4">
                <h4 class="font-bold text-primary">💡 Tips Mengingat & Muroja'ah</h4>
                <ul class="list-disc pl-5 mt-1 space-y-1.5 text-xs">
                  <li v-for="tips in result.tips_hafalan" :key="tips" class="leading-relaxed text-text/80">{{ tips }}</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

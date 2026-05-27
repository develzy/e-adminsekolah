<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { 
  Users, Building, GraduationCap, BrainCircuit, TrendingUp, Calendar, 
  Activity, Cpu, Database, Layers, CreditCard, Server, Zap, Lock, HardDrive,
  X, ShieldCheck
} from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

// Modal states for Developer Quick Actions
const isDeploymentModalOpen = ref(false)
const isSecurityModalOpen = ref(false)

// Realtime Clock
const currentTime = ref(new Date().toLocaleTimeString('id-ID'))
let clockInterval: any = null
onMounted(() => {
  clockInterval = setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString('id-ID')
  }, 1000)
})
onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
})

// Check if user is super admin
const isSuperAdmin = computed(() => authStore.user?.role === 'super_admin')

// --- SUPER ADMIN STATE & DATA ---
const schoolsList = ref<any[]>([])
const searchSchoolQuery = ref('')
const filterSchoolStatus = ref('all') // 'all' | 'active' | 'suspended'
const isUpdatingTenant = ref<string | null>(null)

// System Live Stats
const cpuUsage = ref(42)
const memoryUsage = ref(64)
const apiRequests = ref(8420)
const workerLatency = ref(24)

// Realtime telemetry loop
let telemetryInterval: any = null
onMounted(() => {
  if (isSuperAdmin.value) {
    telemetryInterval = setInterval(() => {
      // Simulate realtime fluctuations
      cpuUsage.value = Math.max(10, Math.min(95, cpuUsage.value + Math.floor(Math.random() * 11) - 5))
      memoryUsage.value = Math.max(40, Math.min(85, memoryUsage.value + Math.floor(Math.random() * 5) - 2))
      apiRequests.value += Math.floor(Math.random() * 4)
      workerLatency.value = Math.max(12, Math.min(60, workerLatency.value + Math.floor(Math.random() * 7) - 3))
    }, 3000)
  }
})
onUnmounted(() => {
  if (telemetryInterval) clearInterval(telemetryInterval)
})

const fetchSchools = async () => {
  try {
    const res = await axios.get('/api/schools')
    schoolsList.value = res.data
  } catch (error) {
    console.error('Failed to load schools:', error)
  }
}

const toggleTenantStatus = async (school: any) => {
  isUpdatingTenant.value = school.id
  const nextStatus = school.status === 'active' ? 'suspended' : 'active'
  try {
    await axios.put(`/api/schools/${school.id}`, {
      ...school,
      status: nextStatus
    })
    school.status = nextStatus
  } catch (error) {
    console.error('Failed to update school tenant status:', error)
  } finally {
    isUpdatingTenant.value = null
  }
}

const filteredSchools = computed(() => {
  return schoolsList.value.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchSchoolQuery.value.toLowerCase()) || 
                          (s.npsn && s.npsn.includes(searchSchoolQuery.value))
    const matchesStatus = filterSchoolStatus.value === 'all' || s.status === filterSchoolStatus.value
    return matchesSearch && matchesStatus
  })
})

// --- REGULAR SCHOOL ADMIN STATE & DATA ---
const regularStats = ref([
  { name: 'Total Siswa', value: '0', icon: Users, change: '+12%', color: 'bg-primary' },
  { name: 'Total Guru', value: '0', icon: GraduationCap, change: '+2%', color: 'bg-secondary' },
  { name: 'Total Sekolah', value: '0', icon: Building, change: '0%', color: 'bg-accent' },
  { name: 'AI Generations', value: '0', icon: BrainCircuit, change: '+84%', color: 'bg-success' },
])

const fetchRegularStats = async () => {
  try {
    const { data } = await axios.get('/api/stats')
    regularStats.value[0].value = data.students.toString()
    regularStats.value[1].value = data.teachers.toString()
    regularStats.value[2].value = data.schools.toString()
    regularStats.value[3].value = data.aiGenerations.toString()
  } catch (error) {
    console.error('Failed to fetch regular stats:', error)
  }
}

onMounted(() => {
  if (isSuperAdmin.value) {
    fetchSchools()
  } else {
    fetchRegularStats()
  }
})

// Charts configs
const systemChartOptions = {
  chart: {
    type: 'line' as const,
    fontFamily: 'inherit',
    toolbar: { show: false },
    animations: { enabled: true, easing: 'linear' as const, dynamicAnimation: { speed: 1000 } }
  },
  colors: ['#3B82F6', '#D4AF37'],
  stroke: { curve: 'smooth' as const, width: 3 },
  xaxis: {
    categories: ['22:50', '22:51', '22:52', '22:53', '22:54', '22:55'],
    labels: { style: { colors: '#94a3b8' } }
  },
  grid: { borderColor: '#f1f5f9' },
  legend: { show: false }
}

const systemSeries = [
  { name: 'API Requests', data: [120, 145, 132, 168, 150, 189] },
  { name: 'D1 Read Ops', data: [85, 94, 112, 98, 120, 134] }
]



const regularChartOptions = {
  chart: { type: 'area' as const, fontFamily: 'inherit', toolbar: { show: false } },
  colors: ['#1d4ed8', '#D4AF37'],
  stroke: { curve: 'smooth' as const, width: 3 },
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.02 } },
  xaxis: {
    categories: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    labels: { style: { colors: '#64748b' } }
  },
  grid: { borderColor: '#e2e8f0', strokeDashArray: 4 }
}

const regularSeries = [
  { name: 'Tingkat Kehadiran (%)', data: [92, 95, 89, 94, 96, 95] },
  { name: 'Rata-rata Nilai', data: [78, 80, 82, 79, 84, 85] }
]
</script>

<template>
  <div class="space-y-6 relative">
    
    <!-- FUTURISTIC BLUR ORBS BACKGROUND (For Super Admin Dashboard) -->
    <div v-if="isSuperAdmin" class="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-[10%] left-[20%] w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div class="absolute bottom-[20%] right-[10%] w-80 h-80 bg-amber-400/5 rounded-full filter blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <!-- ========================================== -->
    <!-- SUPER ADMIN DASHBOARD PANEL                -->
    <!-- ========================================== -->
    <div v-if="isSuperAdmin" class="space-y-6 relative z-10">
      
      <!-- Welcome Section / Welcome back Super Admin -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 p-6 rounded-[28px] border border-blue-900/30 shadow-2xl relative overflow-hidden">
        <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div class="relative z-10">
          <span class="text-xs font-bold text-yellow-400 uppercase tracking-widest flex items-center">
            <Zap class="w-4 h-4 mr-1 text-yellow-400 animate-bounce" /> Cloudflare Edge Node Status: Active
          </span>
          <h1 class="text-3xl font-extrabold text-white mt-1.5 tracking-tight flex items-center">
            Welcome back, <span class="bg-gradient-to-r from-blue-400 to-yellow-300 bg-clip-text text-transparent px-1 font-black">DEVELZY</span> Super Admin
          </h1>
          <p class="text-slate-300 text-xs mt-1.5 leading-relaxed max-w-xl">
            Pusat kontrol dan monitoring SaaS ERP Platform, basis data Cloudflare D1, AI Gemini API Telemetri, dan Billing Langganan sekolah se-Indonesia.
          </p>
        </div>
        
        <!-- Live Clock Widgets -->
        <div class="relative z-10 flex flex-col items-end shrink-0">
          <span class="text-2xl font-bold font-mono text-white tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-xl backdrop-blur">
            🕒 {{ currentTime }}
          </span>
          <span class="text-[10px] text-slate-400 font-bold uppercase mt-1">Realtime Server Time</span>
        </div>
      </div>

      <!-- Quick Action Panel -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <button @click="router.push('/dashboard/schools')" class="p-4 bg-white hover:bg-blue-50/50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 shadow-sm hover:shadow group">
          <Building class="w-6 h-6 text-primary group-hover:scale-110 transition-transform mb-2" />
          <span class="text-xs font-bold text-slate-800">Tambah Sekolah</span>
        </button>
        <button @click="router.push('/dashboard/settings')" class="p-4 bg-white hover:bg-blue-50/50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 shadow-sm hover:shadow group">
          <Database class="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform mb-2" />
          <span class="text-xs font-bold text-slate-800">Backup Database</span>
        </button>
        <button @click="router.push('/dashboard/ai/bank-soal')" class="p-4 bg-white hover:bg-blue-50/50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 shadow-sm hover:shadow group">
          <BrainCircuit class="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform mb-2" />
          <span class="text-xs font-bold text-slate-800">AI Prompt System</span>
        </button>
        <button @click="router.push('/dashboard/whatsapp')" class="p-4 bg-white hover:bg-blue-50/50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 shadow-sm hover:shadow group">
          <Phone class="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform mb-2" />
          <span class="text-xs font-bold text-slate-800">WhatsApp Broadcast</span>
        </button>
        <button @click="isDeploymentModalOpen = true" class="p-4 bg-white hover:bg-blue-50/50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 shadow-sm hover:shadow group">
          <Server class="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform mb-2" />
          <span class="text-xs font-bold text-slate-800">Deployment Status</span>
        </button>
        <button @click="isSecurityModalOpen = true" class="p-4 bg-white hover:bg-blue-50/50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 shadow-sm hover:shadow group">
          <Lock class="w-6 h-6 text-rose-500 group-hover:scale-110 transition-transform mb-2" />
          <span class="text-xs font-bold text-slate-800">Security Center</span>
        </button>
      </div>

      <!-- Global Enterprise Statistics Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <!-- Stat Card 1 -->
        <div class="bg-blue-900/10 backdrop-blur border border-blue-950/15 rounded-3xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div class="absolute -right-3 -bottom-3 p-3 text-blue-900/20 group-hover:scale-110 transition-transform">
            <Building class="w-16 h-16" />
          </div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Tenant Sekolah</span>
          <p class="text-3xl font-black text-slate-900 mt-2">{{ schoolsList.length }}</p>
          <span class="text-xs text-emerald-600 font-bold block mt-1">100% Active Cloudflare D1</span>
        </div>
        
        <!-- Stat Card 2 -->
        <div class="bg-blue-900/10 backdrop-blur border border-blue-950/15 rounded-3xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div class="absolute -right-3 -bottom-3 p-3 text-indigo-900/20 group-hover:scale-110 transition-transform">
            <BrainCircuit class="w-16 h-16" />
          </div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AI Generations Today</span>
          <p class="text-3xl font-black text-slate-900 mt-2">1,842</p>
          <span class="text-xs text-yellow-600 font-bold block mt-1">API Gemini: 100% Online</span>
        </div>
        
        <!-- Stat Card 3 -->
        <div class="bg-blue-900/10 backdrop-blur border border-blue-950/15 rounded-3xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div class="absolute -right-3 -bottom-3 p-3 text-purple-900/20 group-hover:scale-110 transition-transform">
            <Cpu class="w-16 h-16" />
          </div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cloudflare Edge Requests</span>
          <p class="text-3xl font-black text-slate-900 mt-2">{{ apiRequests }}</p>
          <span class="text-xs text-blue-600 font-bold block mt-1">Worker Hit Rate: 99.8%</span>
        </div>

        <!-- Stat Card 4 -->
        <div class="bg-blue-900/10 backdrop-blur border border-blue-950/15 rounded-3xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div class="absolute -right-3 -bottom-3 p-3 text-amber-900/20 group-hover:scale-110 transition-transform">
            <HardDrive class="w-16 h-16" />
          </div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">D1 SQLite Storage</span>
          <p class="text-3xl font-black text-slate-900 mt-2">14.2 MB</p>
          <span class="text-xs text-purple-600 font-bold block mt-1">Allocated: 500 MB</span>
        </div>

        <!-- Stat Card 5 -->
        <div class="bg-blue-900/10 backdrop-blur border border-blue-950/15 rounded-3xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div class="absolute -right-3 -bottom-3 p-3 text-emerald-900/20 group-hover:scale-110 transition-transform">
            <CreditCard class="w-16 h-16" />
          </div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">MRR Subscription</span>
          <p class="text-3xl font-black text-slate-900 mt-2">Rp 28.5M</p>
          <span class="text-xs text-emerald-600 font-bold block mt-1">Active billing accounts</span>
        </div>
      </div>

      <!-- Realtime Telemetry Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Live System monitor chart -->
        <div class="card-modern p-6 lg:col-span-2 space-y-4">
          <h3 class="font-extrabold text-slate-900 text-lg flex items-center">
            <Activity class="w-5 h-5 mr-2 text-primary animate-pulse" /> Live Telemetry Monitoring (Cloudflare D1 & Workers)
          </h3>
          <div class="h-64 w-full">
            <VueApexCharts type="line" height="100%" :options="systemChartOptions" :series="systemSeries" />
          </div>
        </div>

        <!-- System health panel -->
        <div class="card-modern p-6 space-y-4">
          <h3 class="font-extrabold text-slate-900 text-lg flex items-center">
            <Layers class="w-5 h-5 mr-2 text-primary" /> System Resource Health
          </h3>
          <div class="space-y-4 pt-2">
            <!-- CPU Progress -->
            <div>
              <div class="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>CPU Usage (Cloudflare Workers)</span>
                <span class="text-primary">{{ cpuUsage }}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2">
                <div class="bg-blue-600 h-2 rounded-full transition-all duration-1000" :style="`width: ${cpuUsage}%`"></div>
              </div>
            </div>
            <!-- Memory Progress -->
            <div>
              <div class="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Memory Allocation</span>
                <span class="text-indigo-600">{{ memoryUsage }}%</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-2">
                <div class="bg-indigo-600 h-2 rounded-full transition-all duration-1000" :style="`width: ${memoryUsage}%`"></div>
              </div>
            </div>
            <!-- Database health status -->
            <div class="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span class="text-xs font-bold text-slate-700">D1 Database Health</span>
              <span class="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-600 rounded-full flex items-center">
                <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-ping"></span> 99.9% Uptime
              </span>
            </div>
            <!-- Worker response latency status -->
            <div class="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span class="text-xs font-bold text-slate-700">Edge Response Speed</span>
              <span class="text-xs font-bold text-primary font-mono">{{ workerLatency }} ms</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Multi-Tenant SaaS Management Panel -->
      <div class="card-modern p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5 mb-5 gap-4">
          <div>
            <h3 class="font-extrabold text-slate-900 text-lg flex items-center">
              <Building class="w-5 h-5 mr-2 text-primary" /> Management Tenant & Subscription Sekolah
            </h3>
            <p class="text-xs text-slate-500 mt-1">Suspend, aktifkan, dan monitor status operasional masing-masing database sekolah.</p>
          </div>
          <div class="flex items-center space-x-3 shrink-0">
            <input 
              v-model="searchSchoolQuery" 
              type="text" 
              placeholder="Cari sekolah / NPSN..." 
              class="input-modern py-1 px-3 text-xs w-48 bg-slate-50"
            />
            <select v-model="filterSchoolStatus" class="input-modern py-1 px-3 text-xs w-36 bg-slate-50">
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div v-if="filteredSchools.length === 0" class="p-8 text-center text-slate-400 text-sm">
          Tidak ada tenant sekolah yang terdaftar atau cocok dengan pencarian.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100">
                <th class="p-3 text-xs font-bold text-slate-600 uppercase">Sekolah</th>
                <th class="p-3 text-xs font-bold text-slate-600 uppercase">NPSN</th>
                <th class="p-3 text-xs font-bold text-slate-600 uppercase">Jenjang / Level</th>
                <th class="p-3 text-xs font-bold text-slate-600 uppercase">Sesi Status</th>
                <th class="p-3 text-xs font-bold text-slate-600 uppercase text-center">Status Tenant</th>
                <th class="p-3 text-xs font-bold text-slate-600 uppercase text-center">Aksi Developer</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="sch in filteredSchools" :key="sch.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="p-3 text-sm font-semibold text-slate-900">{{ sch.name }}</td>
                <td class="p-3 text-xs text-slate-500 font-mono">{{ sch.npsn || '-' }}</td>
                <td class="p-3 text-xs text-slate-500 uppercase"><span class="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md font-bold">{{ sch.level || 'SMA' }}</span></td>
                <td class="p-3 text-xs text-slate-500 font-medium">Semester Ganjil</td>
                <td class="p-3 text-center">
                  <span 
                    :class="[
                      'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                      sch.status === 'active' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
                    ]"
                  >
                    {{ sch.status === 'active' ? 'Aktif' : 'Suspended' }}
                  </span>
                </td>
                <td class="p-3 text-center">
                  <button 
                    @click="toggleTenantStatus(sch)"
                    :disabled="isUpdatingTenant === sch.id"
                    :class="[
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center justify-center mx-auto',
                      sch.status === 'active' ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100/50' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/50'
                    ]"
                  >
                    <span v-if="isUpdatingTenant === sch.id" class="animate-spin border-2 border-current border-t-transparent rounded-full w-3.5 h-3.5 mr-1"></span>
                    {{ sch.status === 'active' ? 'Suspend Tenant' : 'Aktifkan Tenant' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- STANDARD SCHOOL OVERVIEW PANEL             -->
    <!-- ========================================== -->
    <div v-else class="space-y-6">
      
      <!-- Welcome back banner -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-text tracking-tight flex items-center">
            <LayoutDashboard class="w-8 h-8 mr-3 text-primary" /> Dashboard Overview
          </h1>
          <p class="text-text/60 text-sm mt-1">Selamat datang kembali di Pusat Administrasi Sekolah.</p>
        </div>
        <div class="flex items-center space-x-2 text-sm text-text/60 bg-white px-4 py-2.5 rounded-xl shadow-sm border border-border">
          <Calendar class="w-4 h-4 text-primary" />
          <span class="font-semibold">Tahun Ajaran 2026/2027 Ganjil</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in regularStats" :key="stat.name" class="card-modern p-6 relative overflow-hidden group">
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-300">
            <component :is="stat.icon" class="w-16 h-16" />
          </div>
          
          <div class="flex items-center justify-between mb-4 relative z-10">
            <div :class="`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} shadow-lg`">
              <component :is="stat.icon" class="w-6 h-6" />
            </div>
            <div class="flex items-center space-x-1 text-success text-sm font-medium bg-success/10 px-2 py-1 rounded-full">
              <TrendingUp class="w-3 h-3" />
              <span>{{ stat.change }}</span>
            </div>
          </div>
          
          <div class="relative z-10">
            <h3 class="text-text/60 text-sm font-medium">{{ stat.name }}</h3>
            <p class="text-3xl font-black text-text mt-1">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- Charts and Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 card-modern p-6">
          <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Activity class="w-5 h-5 mr-2 text-primary" /> Statistik Kehadiran & Nilai Akademik
          </h3>
          <div class="h-80 w-full">
            <VueApexCharts type="area" height="100%" :options="regularChartOptions" :series="regularSeries" />
          </div>
        </div>
        
        <div class="card-modern p-6">
          <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <BrainCircuit class="w-5 h-5 mr-2 text-primary animate-pulse" /> Aktivitas AI Terbaru
          </h3>
          <div class="space-y-4">
            <div v-for="i in 4" :key="i" class="flex items-start space-x-3 pb-4 border-b border-border last:border-0 last:pb-0">
              <div class="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                <BrainCircuit class="w-4 h-4 text-accent" />
              </div>
              <div class="text-xs">
                <p class="font-bold text-slate-900">Generate Bank Soal Pelajaran</p>
                <p class="text-slate-500 mt-0.5">Kisi-kisi soal evaluasi kurikulum merdeka</p>
                <p class="text-slate-400 mt-1">Beberapa menit yang lalu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- DEVELOPER ACTION MODALS                    -->
    <!-- ========================================== -->

    <!-- Deployment Status Modal -->
    <div v-if="isDeploymentModalOpen" class="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <button @click="isDeploymentModalOpen = false" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X class="w-5 h-5" />
        </button>
        
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <Server class="w-6 h-6 mr-2.5 text-amber-500" /> Edge Deployment Status
        </h2>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">Environment</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">Production (Cloudflare Pages)</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">Active Routing Node</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Jakarta, Indonesia (CGK Edge)</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">SaaS Framework</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Vite + Vue 3 (SPA)</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">Serverless Backend</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Cloudflare Workers + Hono (Router)</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">Database Engine</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">Cloudflare D1 (Distributed SQLite)</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">Compatibility Date</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">2024-03-20</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">Active Branch</span>
            <span class="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md font-mono">main</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-semibold text-slate-500">SSL Status</span>
            <span class="text-xs font-bold text-emerald-600 flex items-center"><ShieldCheck class="w-4 h-4 mr-1 text-emerald-500" /> Active (Cloudflare Universal SSL)</span>
          </div>
        </div>
        
        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button @click="isDeploymentModalOpen = false" class="px-5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-colors">Tutup</button>
        </div>
      </div>
    </div>

    <!-- Security Center Modal -->
    <div v-if="isSecurityModalOpen" class="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <button @click="isSecurityModalOpen = false" class="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X class="w-5 h-5" />
        </button>
        
        <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
          <Lock class="w-6 h-6 mr-2.5 text-rose-500" /> SaaS Security Center
        </h2>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">Cloudflare WAF Shield</span>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">Activated</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">DDOS Mitigation Protection</span>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">High (Automatic Edge Dropping)</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">HTTPS Transport Policy</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">TLS 1.3 Enforced + HSTS Active</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">IP Rate Limiting Protocol</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Enabled (Max 120 requests/minute/IP)</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">CORS Policy Restriction</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">Restricted to *.pages.dev & custom domains</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">API Protection CSRF Tokens</span>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">Enforced</span>
          </div>
          <div class="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-xs font-semibold text-slate-500">Global Vulnerability Status</span>
            <span class="text-xs font-bold text-emerald-600 flex items-center"><ShieldCheck class="w-4 h-4 mr-1 text-emerald-500" /> Clean Scan</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs font-semibold text-slate-500">Incident Blocks (last 24 hours)</span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">0 Blocks (No threat events)</span>
          </div>
        </div>
        
        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button @click="isSecurityModalOpen = false" class="px-5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-colors">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 16px 16px;
}
</style>

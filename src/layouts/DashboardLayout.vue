<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import axios from 'axios'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  LogOut,
  BrainCircuit,
  FileText,
  Building,
  Menu,
  X,
  CheckCircle,
  ClipboardList,
  Activity,
  Cpu,
  DollarSign,
  Phone,
  Bookmark
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const isSidebarOpen = ref(true)

const schools = ref<any[]>([])
const selectedSchoolId = ref('')

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Fetch schools and initialize active school context
onMounted(async () => {
  try {
    const res = await axios.get('/api/schools')
    schools.value = res.data
    
    // Check if school is already set in store or localStorage
    const savedSchool = localStorage.getItem('activeSchool')
    if (savedSchool) {
      const parsed = JSON.parse(savedSchool)
      authStore.setSchool(parsed)
      selectedSchoolId.value = parsed.id
    } else if (res.data.length > 0) {
      authStore.setSchool(res.data[0])
      selectedSchoolId.value = res.data[0].id
      localStorage.setItem('activeSchool', JSON.stringify(res.data[0]))
    } else {
      // Default fallback context
      const defaultSchool = { id: 'default-school', name: 'SDN Kalisalak', level: 'SD' }
      authStore.setSchool(defaultSchool)
      localStorage.setItem('activeSchool', JSON.stringify(defaultSchool))
    }
  } catch (error) {
    console.error('Error fetching schools:', error)
    // Default fallback
    const defaultSchool = { id: 'default-school', name: 'SDN Kalisalak', level: 'SD' }
    authStore.setSchool(defaultSchool)
    localStorage.setItem('activeSchool', JSON.stringify(defaultSchool))
  }
})

const handleSchoolChange = () => {
  const selected = schools.value.find(s => s.id === selectedSchoolId.value)
  if (selected) {
    authStore.setSchool(selected)
    localStorage.setItem('activeSchool', JSON.stringify(selected))
  }
}

// Grouped Menu Structure with 'levels' criteria
const menuGroups = [
  {
    title: 'MENU UTAMA',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['super_admin', 'admin_sekolah', 'guru'] }
    ]
  },
  {
    title: 'MASTER DATA',
    items: [
      { name: 'Data Sekolah', icon: Building, path: '/dashboard/schools', roles: ['super_admin'] },
      { name: 'Data Guru', icon: Users, path: '/dashboard/teachers', roles: ['super_admin', 'admin_sekolah'] },
      { name: 'Data Siswa', icon: GraduationCap, path: '/dashboard/students', roles: ['super_admin', 'admin_sekolah'] }
    ]
  },
  {
    title: 'AKADEMIK & RAPORT',
    items: [
      { name: 'Penilaian Siswa', icon: BookOpen, path: '/dashboard/academic', roles: ['super_admin', 'admin_sekolah', 'guru'] },
      { name: 'Input Spreadsheet', icon: CheckCircle, path: '/dashboard/penilaian', roles: ['super_admin', 'admin_sekolah', 'guru'] },
      { name: 'Raport Digital', icon: FileText, path: '/dashboard/reports', roles: ['super_admin', 'admin_sekolah', 'guru'] }
    ]
  },
  {
    title: 'AI EDUCATION',
    items: [
      { name: 'Dashboard AI', icon: BrainCircuit, path: '/dashboard/ai/bank-soal', roles: ['super_admin', 'admin_sekolah', 'guru'] }
    ]
  },
  {
    title: 'CBT ONLINE',
    items: [
      { name: 'CBT Ujian Online', icon: ClipboardList, path: '/dashboard/cbt', roles: ['super_admin', 'admin_sekolah', 'guru'] }
    ]
  },
  {
    title: 'KESISWAAN & ABSENSI',
    items: [
      { name: 'Kesiswaan & Absen', icon: Activity, path: '/dashboard/kesiswaan', roles: ['super_admin', 'admin_sekolah', 'guru'] }
    ]
  },
  {
    title: 'PESANTREN',
    items: [
      { name: 'Pesantren & Kitab', icon: BookOpen, path: '/dashboard/pesantren', roles: ['super_admin', 'admin_sekolah', 'guru'], levels: ['PONDOK PESANTREN'] }
    ]
  },
  {
    title: 'ERP SUB-MODUL',
    items: [
      { name: 'Parent Portal', icon: Users, path: '/dashboard/parent', roles: ['super_admin', 'admin_sekolah', 'guru'] },
      { name: 'SMK Center', icon: Cpu, path: '/dashboard/smk', roles: ['super_admin', 'admin_sekolah', 'guru'], levels: ['SMK'] },
      { name: 'Keuangan & SPP', icon: DollarSign, path: '/dashboard/finance', roles: ['super_admin', 'admin_sekolah', 'guru'] },
      { name: 'Perpustakaan', icon: Bookmark, path: '/dashboard/library', roles: ['super_admin', 'admin_sekolah', 'guru'] },
      { name: 'WhatsApp Center', icon: Phone, path: '/dashboard/whatsapp', roles: ['super_admin', 'admin_sekolah', 'guru'] }
    ]
  },
  {
    title: 'PENGATURAN',
    items: [
      { name: 'Pengaturan Sistem', icon: Settings, path: '/dashboard/settings', roles: ['super_admin', 'admin_sekolah', 'guru'] }
    ]
  }
]

const getFilteredGroups = computed(() => {
  const role = authStore.user?.role || 'guru'
  const activeLevel = authStore.school?.level?.toUpperCase() || ''
  
  return menuGroups.map(group => {
    const filteredItems = group.items.filter(item => {
      // 1. Check user role
      if (!item.roles.includes(role)) return false
      // 2. Check school level/type restriction
      if (item.levels && !item.levels.map(l => l.toUpperCase()).includes(activeLevel)) return false
      return true
    })
    
    return {
      ...group,
      items: filteredItems
    }
  }).filter(group => group.items.length > 0)
})

const getInitials = (name: string) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<template>
  <div class="h-screen bg-background flex overflow-hidden font-sans">
    <!-- Sidebar with Custom Premium Linear Gradient & Backdrop Blur -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 text-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col sidebar-glass-animated',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="h-20 flex flex-col justify-center px-6 border-b border-white/10 flex-shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded bg-white flex items-center justify-center overflow-hidden p-1 shadow-md border border-yellow-400/30">
              <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
            </div>
            <div>
              <span class="text-base font-extrabold tracking-tight">DEVELZY ERP</span>
              <p class="text-[9px] text-white/50 font-bold uppercase tracking-wider">v2.1 • Multi-Jenjang</p>
            </div>
          </div>
          <button @click="toggleSidebar" class="lg:hidden text-white/80 hover:text-yellow-400">
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Navigation Menu Groups -->
      <nav class="p-4 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
        <div v-for="group in getFilteredGroups" :key="group.title" class="space-y-1">
          <!-- Section Title with Accent Gold -->
          <div class="text-[9px] font-bold text-accent tracking-wider uppercase px-3 py-1 flex items-center justify-between">
            <span>{{ group.title }}</span>
            <span class="w-8 h-[1px] bg-accent/25"></span>
          </div>

          <router-link
            v-for="item in group.items"
            :key="item.name"
            :to="item.path"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 group"
            exact-active-class="bg-white/15 text-yellow-400 shadow-md"
            inactive-class="text-white/70 hover:bg-white/5 hover:text-white"
          >
            <component :is="item.icon" class="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
            <span>{{ item.name }}</span>
          </router-link>
        </div>

        <!-- Logout Button -->
        <div class="pt-4 mt-4 border-t border-white/10">
          <button
            @click="handleLogout"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-500/20 hover:text-red-200 w-full transition-colors"
          >
            <LogOut class="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
      
      <!-- Footer Sidebar -->
      <div class="p-3 text-center text-[10px] text-white/40 border-t border-white/10 flex-shrink-0 bg-blue-950/20">
        <p>&copy; 2026 E-Admin Sekolah</p>
        <p>Powered by <span class="font-bold text-yellow-400">Develzy AI</span></p>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Header -->
      <header class="h-16 bg-surface border-b border-border flex items-center justify-between px-6 z-10 flex-shrink-0">
        <button @click="toggleSidebar" class="text-text hover:text-primary lg:hidden">
          <Menu class="w-6 h-6" />
        </button>
        
        <div class="hidden lg:flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <span class="text-xs font-bold text-text/60">Sesi Sekolah:</span>
            <select 
              v-if="schools.length > 0" 
              v-model="selectedSchoolId" 
              @change="handleSchoolChange"
              class="input-modern py-1 px-3 text-xs bg-background font-bold text-primary w-52"
            >
              <option v-for="sch in schools" :key="sch.id" :value="sch.id">
                🏫 {{ sch.name }} ({{ sch.level }})
              </option>
            </select>
            <span v-else class="text-xs text-text/50 font-bold bg-background px-3 py-1.5 rounded-lg border border-border">
              🏫 {{ authStore.school?.name || 'SDN Kalisalak' }} ({{ authStore.school?.level || 'SD' }})
            </span>
          </div>
          <span class="text-xs text-text/50 font-bold bg-background px-3 py-1.5 rounded-lg border border-border">
            🗓️ Tahun Ajaran: 2026/2027 Ganjil
          </span>
        </div>

        <div class="flex items-center space-x-4 ml-auto">
          <div class="flex items-center space-x-3 cursor-pointer p-2 rounded-xl hover:bg-background transition-all duration-200 border border-transparent hover:border-border">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-sm">
              {{ getInitials(authStore.user?.name) }}
            </div>
            <div class="hidden md:block text-sm">
              <p class="font-medium text-text">{{ authStore.user?.name || 'User' }}</p>
              <p class="text-xs text-text/60">{{ authStore.user?.email || '' }}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto bg-background p-6 lg:p-8 custom-scrollbar">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Mobile Overlay -->
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 bg-blue-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
    ></div>
  </div>
</template>

<style scoped>
@keyframes gradientAnimation {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.sidebar-glass-animated {
  background: linear-gradient(135deg, rgba(29,78,216,0.95) 0%, rgba(37,99,235,0.88) 50%, rgba(30,58,138,0.97) 100%);
  background-size: 200% 200%;
  animation: gradientAnimation 12s ease infinite;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>


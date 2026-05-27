<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowRight, User, Info, Check, Briefcase, Crown } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const fullname = ref('')
const nip = ref('')
const level = ref('SD')
const packageType = ref('PREMIUM') // PREMIUM (3 Tahun) or PREMIUM_LIFETIME (Lifetime)
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const response = await axios.post('/api/auth/register', {
      name: fullname.value,
      nip: nip.value,
      level: level.value,
      packageType: packageType.value,
      username: username.value,
      password: password.value
    })
    
    if (response.data.token) {
      successMessage.value = 'Pendaftaran berhasil! Mengalihkan ke dashboard...'
      
      authStore.setToken(response.data.token)
      authStore.setUser({
        name: response.data.name,
        role: response.data.role,
        email: response.data.email
      })
      if (response.data.school) {
        authStore.setSchool(response.data.school)
        localStorage.setItem('activeSchool', JSON.stringify(response.data.school))
      }
      
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    }
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.response?.data?.error || 'Gagal mendaftar. Silakan coba lagi.'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 md:p-8 overflow-hidden relative">
    
    <!-- Modern Floating Toast Notification (Error/Success) -->
    <transition name="toast">
      <div v-if="errorMessage || successMessage" class="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <div 
          v-if="errorMessage" 
          class="bg-white text-rose-600 px-6 py-4 rounded-2xl shadow-2xl border border-rose-100 flex items-center space-x-3 w-full animate-in slide-in-from-top-10"
        >
          <div class="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle class="w-6 h-6 text-rose-500" />
          </div>
          <p class="text-sm font-semibold text-slate-800 leading-tight flex-1">{{ errorMessage }}</p>
        </div>

        <div 
          v-if="successMessage" 
          class="bg-white text-emerald-600 px-6 py-4 rounded-2xl shadow-2xl border border-emerald-100 flex items-center space-x-3 w-full animate-in slide-in-from-top-10"
        >
          <div class="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
            <Check class="w-6 h-6 text-emerald-500" />
          </div>
          <p class="text-sm font-semibold text-slate-800 leading-tight flex-1">{{ successMessage }}</p>
        </div>
      </div>
    </transition>

    <!-- Main Card Container: Split Design -->
    <div class="w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative z-10 border border-slate-800/10 min-h-[640px]">
      
      <!-- LEFT PANEL: Animated Moving Gradient & Branding -->
      <div class="hidden md:flex md:w-5/12 text-white flex-col justify-between relative overflow-hidden bg-gradient-to-tr from-[#0B132B] via-[#1C2541] to-[#0B132B] p-12 border-r border-slate-100/5">
        
        <!-- Animated Blobs / Moving Colors Background -->
        <div class="absolute inset-0 z-0">
          <div class="absolute -top-36 -left-36 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-pulse duration-5000"></div>
          <div class="absolute -bottom-36 -right-36 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-pulse duration-7000"></div>
          <!-- Grid Overlay -->
          <div class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        </div>

        <!-- Brand Logo Header -->
        <div class="relative z-10 flex items-center space-x-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-blue-500 p-2 shadow-lg shadow-primary/25 flex items-center justify-center border border-white/10">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <span class="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">DEVELZY</span>
            <span class="text-[10px] text-amber-400 font-extrabold block -mt-1 tracking-wider uppercase">ERP SYSTEM</span>
          </div>
        </div>

        <!-- Middle Text -->
        <div class="relative z-10 space-y-6 my-auto pr-4">
          <h1 class="text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
            Transformasi Digital <br />
            <span class="bg-gradient-to-r from-blue-400 via-sky-400 to-teal-300 bg-clip-text text-transparent font-black">Administrasi Sekolah</span>
          </h1>
          <p class="text-sm text-slate-400 leading-relaxed max-w-sm">
            Platform administrasi sekolah berbasis multi-tenant dengan isolasi data tingkat tinggi. Aman, responsif, dan didukung kecerdasan buatan.
          </p>
        </div>

        <!-- Left Panel Footer / Didukung Oleh -->
        <div class="relative z-10 pt-8 border-t border-slate-800/80 flex items-center space-x-4">
          <div class="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center p-2 backdrop-blur-sm">
            <!-- Simplified Tut Wuri Handayani vector -->
            <svg viewBox="0 0 100 100" class="w-full h-full text-sky-400 fill-current">
              <polygon points="50,5 95,38 78,92 22,92 5,38" fill="none" stroke="currentColor" stroke-width="6"/>
              <path d="M50,20 C45,32 25,38 20,58 C35,58 45,48 50,63 C55,48 65,58 80,58 C75,38 55,32 50,20 Z" />
              <circle cx="50" cy="42" r="6" />
            </svg>
          </div>
          <div class="flex-1">
            <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Didukung Oleh</span>
            <span class="text-xs text-slate-300 font-medium leading-tight block">Digunakan oleh ribuan guru & tenaga kependidikan profesional</span>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL: Sleek Registration Form -->
      <div class="w-full md:w-7/12 p-8 sm:p-10 md:p-12 bg-white flex flex-col justify-between overflow-y-auto max-h-[90vh] md:max-h-[unset] custom-scrollbar">
        
        <!-- Small logo header for mobile screens -->
        <div class="md:hidden flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-500 p-1.5 shadow-md flex items-center justify-center">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <span class="text-base font-extrabold tracking-tight text-slate-900">DEVELZY</span>
            <span class="text-[8px] text-primary font-bold block -mt-1 tracking-wider uppercase">ERP SYSTEM</span>
          </div>
        </div>

        <!-- Form container -->
        <div class="my-auto max-w-md w-full mx-auto space-y-6">
          <!-- Header title and green database badge -->
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Daftar Akun</h2>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                DATABASE ONLINE
              </span>
            </div>
            <p class="text-sm text-slate-500 mt-1">Buat akun guru baru Anda.</p>
          </div>

          <!-- Main Input Form -->
          <form @submit.prevent="handleRegister" class="space-y-4">
            
            <!-- Nama Lengkap -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Nama Lengkap</label>
              <div class="relative rounded-xl">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User class="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  v-model="fullname"
                  type="text"
                  required
                  class="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200 text-sm"
                  placeholder="Nama Lengkap dengan Gelar"
                />
              </div>
            </div>

            <!-- NIP / NUPTK -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">NIP / NUPTK <span class="text-slate-400 font-normal">(Opsional)</span></label>
              <div class="relative rounded-xl">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Briefcase class="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  v-model="nip"
                  type="text"
                  class="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200 text-sm"
                  placeholder="Masukkan NIP atau NUPTK"
                />
              </div>
            </div>

            <!-- Jenjang Sekolah Dropdown select -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Jenjang Sekolah</label>
              <div class="relative rounded-xl">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <ShieldCheck class="h-4.5 w-4.5 text-slate-400" />
                </div>
                <select
                  v-model="level"
                  class="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200 text-sm appearance-none cursor-pointer"
                >
                  <option value="PAUD">PAUD</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA">SMA</option>
                  <option value="SMK">SMK</option>
                </select>
                <!-- Select arrow -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Paket Langganan Radio Buttons -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Paket Langganan</label>
              <div class="grid grid-cols-2 gap-3">
                <!-- PREMIUM Card -->
                <label 
                  :class="[
                    'border-2 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 relative select-none min-h-[72px]',
                    packageType === 'PREMIUM' 
                      ? 'border-primary bg-blue-50/20 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  ]"
                >
                  <input 
                    type="radio" 
                    v-model="packageType" 
                    value="PREMIUM" 
                    class="sr-only" 
                  />
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black tracking-wider uppercase text-primary">PREMIUM</span>
                    <!-- Check circle if active -->
                    <div 
                      v-if="packageType === 'PREMIUM'" 
                      class="w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center scale-90"
                    >
                      <Check class="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <span class="text-[10px] text-slate-400 font-medium block mt-1">Aktif 3 Tahun</span>
                </label>

                <!-- PREMIUM+ Card -->
                <label 
                  :class="[
                    'border-2 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-200 relative select-none min-h-[72px]',
                    packageType === 'PREMIUM_LIFETIME' 
                      ? 'border-amber-500 bg-amber-50/10 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                  ]"
                >
                  <input 
                    type="radio" 
                    v-model="packageType" 
                    value="PREMIUM_LIFETIME" 
                    class="sr-only" 
                  />
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black tracking-wider uppercase text-amber-600 flex items-center">
                      PREMIUM+
                      <Crown class="w-3 h-3 text-amber-500 ml-1 fill-amber-500/20" />
                    </span>
                    <!-- Check circle if active -->
                    <div 
                      v-if="packageType === 'PREMIUM_LIFETIME'" 
                      class="w-4 h-4 bg-amber-500 text-white rounded-full flex items-center justify-center scale-90"
                    >
                      <Check class="w-2.5 h-2.5" />
                    </div>
                  </div>
                  <span class="text-[10px] text-slate-400 font-medium block mt-1">Lifetime</span>
                </label>
              </div>
            </div>

            <!-- Username Input -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Username</label>
              <div class="relative rounded-xl">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User class="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  v-model="username"
                  type="text"
                  required
                  class="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200 text-sm"
                  placeholder="Pilih username"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <div class="relative rounded-xl">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock class="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="block w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200 text-sm"
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  <EyeOff v-if="showPassword" class="h-4.5 w-4.5" />
                  <Eye v-else class="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            <!-- Submit Button with Arrow -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center text-sm disabled:opacity-50 mt-2"
            >
              <span v-if="!isLoading" class="flex items-center">
                Daftar Sekarang
                <ArrowRight class="w-4 h-4 ml-2" />
              </span>
              <span v-else class="flex items-center">
                <span class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
                Memproses Pendaftaran...
              </span>
            </button>
          </form>

          <!-- Back to Login Link -->
          <div class="text-center">
            <span class="text-xs text-slate-500">
              Sudah punya akun? 
              <router-link to="/login" class="text-primary font-bold hover:underline ml-1">Masuk di sini</router-link>
            </span>
          </div>

          <!-- Bottom Private System Disclaimer Card -->
          <div class="bg-slate-50 border border-slate-200/50 rounded-2xl p-3 flex items-start space-x-3 shadow-inner">
            <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Info class="w-4.5 h-4.5 text-slate-500" />
            </div>
            <p class="text-[11px] text-slate-500 italic leading-relaxed pt-0.5">
              "Akun ini bersifat private bukan akun sharing karena user dan password dapat dirubah"
            </p>
          </div>
        </div>

        <!-- Footer terms and copyright -->
        <div class="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 space-y-2 sm:space-y-0">
          <div class="flex items-center">
            <ShieldCheck class="w-4 h-4 text-emerald-500 mr-1.5" />
            <span>© 2026 DEVELZY. v4.5 All Levels</span>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-slate-600 transition-colors">Kebijakan Privasi</a>
            <a href="#" class="hover:text-slate-600 transition-colors">Syarat & Ketentuan</a>
            <a href="#" class="hover:text-slate-600 transition-colors">Kontak Kami</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

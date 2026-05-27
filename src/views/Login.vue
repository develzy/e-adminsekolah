<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowRight, User, Info } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const showGoogleModal = ref(false)

// List of Google Accounts for demo selection
const googleAccounts = [
  { name: 'DEVELZY Developer', email: 'develzy.im', role: 'Super Admin', initials: 'D', bg: 'bg-indigo-600 text-white' },
  { name: 'Admin TK Demo', email: 'tk@develzy.im', role: 'TK Admin', initials: 'T', bg: 'bg-pink-600 text-white' },
  { name: 'Admin SD Demo', email: 'sd@develzy.im', role: 'SD Admin', initials: 'S', bg: 'bg-blue-600 text-white' },
  { name: 'Admin SMP Demo', email: 'smp@develzy.im', role: 'SMP Admin', initials: 'M', bg: 'bg-amber-600 text-white' },
  { name: 'Admin Pesantren Demo', email: 'pesantren@develzy.im', role: 'Pesantren Admin', initials: 'P', bg: 'bg-purple-600 text-white' }
]

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await axios.post('/api/auth/login', {
      email: email.value,
      password: password.value
    })
    
    if (response.data.token) {
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
      router.push('/dashboard')
    }
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.response?.data?.error || 'Login gagal. Periksa kembali username/email dan password Anda.'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  } finally {
    isLoading.value = false
  }
}

const handleGoogleLogin = async (selectedEmail: string) => {
  showGoogleModal.value = false
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await axios.post('/api/auth/google-login', {
      email: selectedEmail
    })
    
    if (response.data.token) {
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
      router.push('/dashboard')
    }
  } catch (error: any) {
    console.error(error)
    errorMessage.value = error.response?.data?.error || 'Gagal masuk dengan Google.'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  } finally {
    isLoading.value = false
  }
}

const handleForgotPassword = () => {
  errorMessage.value = 'Fitur pemulihan kata sandi telah dicatat ke log audit. Hubungi administrator sekolah Anda untuk mereset kata sandi.'
  setTimeout(() => { errorMessage.value = '' }, 6000)
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 md:p-8 overflow-hidden relative">
    
    <!-- Modern Floating Toast Notification -->
    <transition name="toast">
      <div v-if="errorMessage" class="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <div class="bg-white text-rose-600 px-6 py-4 rounded-2xl shadow-2xl border border-rose-100 flex items-center space-x-3 w-full animate-in slide-in-from-top-10">
          <div class="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle class="w-6 h-6 text-rose-500" />
          </div>
          <p class="text-sm font-semibold text-slate-800 leading-tight flex-1">{{ errorMessage }}</p>
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

      <!-- RIGHT PANEL: Sleek Form with Floating Input Elements -->
      <div class="w-full md:w-7/12 p-8 sm:p-12 md:p-14 bg-white flex flex-col justify-between overflow-y-auto">
        
        <!-- Small logo header for mobile screens -->
        <div class="md:hidden flex items-center space-x-3 mb-8">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-500 p-1.5 shadow-md flex items-center justify-center">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <span class="text-base font-extrabold tracking-tight text-slate-900">DEVELZY</span>
            <span class="text-[8px] text-primary font-bold block -mt-1 tracking-wider uppercase">ERP SYSTEM</span>
          </div>
        </div>

        <!-- Form container -->
        <div class="my-auto max-w-md w-full mx-auto space-y-8">
          <!-- Header title and green database badge -->
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Selamat Datang</h2>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                DATABASE ONLINE
              </span>
            </div>
            <p class="text-sm text-slate-500 mt-2">Masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          <!-- Main Input Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Username Input -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Username</label>
              <div class="relative rounded-xl">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User class="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  v-model="email"
                  type="text"
                  required
                  class="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200 text-sm"
                  placeholder="Masukkan username atau email"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <button type="button" @click="handleForgotPassword" class="text-xs text-primary font-semibold hover:underline focus:outline-none">Lupa Password?</button>
              </div>
              <div class="relative rounded-xl">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock class="h-4.5 w-4.5 text-slate-400" />
                </div>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="block w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200 text-sm"
                  placeholder="Masukkan password Anda"
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
              class="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:shadow-xl transition-all duration-200 flex items-center justify-center text-sm disabled:opacity-50"
            >
              <span v-if="!isLoading" class="flex items-center">
                Masuk Dashboard
                <ArrowRight class="w-4 h-4 ml-2" />
              </span>
              <span v-else class="flex items-center">
                <span class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
                Memproses Autentikasi...
              </span>
            </button>
          </form>

          <!-- Divider label: ATAU -->
          <div class="relative flex py-1 items-center">
            <div class="flex-grow border-t border-slate-100"></div>
            <span class="flex-shrink mx-4 text-[10px] font-black text-slate-400 tracking-wider">ATAU</span>
            <div class="flex-grow border-t border-slate-100"></div>
          </div>

          <!-- Google Login Button -->
          <button
            type="button"
            @click="showGoogleModal = true"
            class="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 flex items-center justify-center text-sm"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" class="mr-2.5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Masuk dengan Google
          </button>

          <!-- Signup Text link -->
          <div class="text-center">
            <span class="text-xs text-slate-500">
              Belum punya akun? 
              <router-link to="/register" class="text-primary font-bold hover:underline ml-1">Daftar sekarang</router-link>
            </span>
          </div>

          <!-- Bottom Private System Disclaimer Card -->
          <div class="bg-slate-50 border border-slate-200/50 rounded-2xl p-3.5 flex items-start space-x-3 shadow-inner">
            <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Info class="w-4.5 h-4.5 text-slate-500" />
            </div>
            <p class="text-xs text-slate-500 italic leading-relaxed pt-0.5">
              "Akun ini bersifat private bukan akun sharing karena user dan password dapat dirubah"
            </p>
          </div>
        </div>

        <!-- Footer terms and copyright -->
        <div class="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-2.5 sm:space-y-0">
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

  <!-- Google Sign-In Selector Overlay Modal -->
  <transition name="fade">
    <div v-if="showGoogleModal" class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        class="bg-white rounded-[2rem] max-w-sm w-full p-6 shadow-2xl border border-slate-100 flex flex-col relative animate-in zoom-in-95 duration-200"
        @click.stop
      >
        <!-- Close dialog button -->
        <button 
          @click="showGoogleModal = false" 
          class="absolute top-5 right-5 text-slate-400 hover:text-slate-600 focus:outline-none text-xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50"
        >
          &times;
        </button>

        <!-- Google branding -->
        <div class="flex flex-col items-center text-center pb-5 border-b border-slate-100">
          <svg viewBox="0 0 24 24" width="30" height="30" class="mb-3">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <h3 class="text-lg font-bold text-slate-800 leading-tight">Pilih Akun Demo</h3>
          <p class="text-xs text-slate-500 mt-1">untuk melanjutkan ke DEVELZY ERP</p>
        </div>

        <!-- Google-style list of demo accounts -->
        <div class="mt-4 max-h-[320px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          <button
            v-for="acc in googleAccounts"
            :key="acc.email"
            @click="handleGoogleLogin(acc.email)"
            class="w-full flex items-center p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left focus:outline-none group"
          >
            <!-- Google avatar circle with initials -->
            <div :class="`w-9 h-9 rounded-full ${acc.bg} flex items-center justify-center text-sm font-bold mr-3.5 flex-shrink-0 group-hover:scale-105 transition-transform`">
              {{ acc.initials }}
            </div>
            <div class="flex-grow">
              <div class="text-sm font-bold text-slate-800 leading-none">{{ acc.name }}</div>
              <div class="text-xs text-slate-500 mt-1 leading-none">{{ acc.email }}</div>
            </div>
            <!-- Role tag -->
            <span class="text-[9px] bg-slate-100 group-hover:bg-primary/10 group-hover:text-primary transition-colors text-slate-600 font-semibold px-2 py-0.5 rounded-md uppercase scale-90 flex-shrink-0">
              {{ acc.role }}
            </span>
          </button>
        </div>

        <!-- Option to close and do manual login -->
        <div class="mt-4 pt-3 border-t border-slate-100 text-center">
          <button 
            @click="showGoogleModal = false" 
            class="text-xs text-primary font-bold hover:text-blue-700 focus:outline-none"
          >
            Batal & Gunakan Login Manual
          </button>
        </div>
      </div>
    </div>
  </transition>
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.custom-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

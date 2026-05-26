<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { LogIn, ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')

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
    errorMessage.value = 'Login gagal. Periksa kembali email dan password Anda.'
    setTimeout(() => { errorMessage.value = '' }, 5000)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 md:p-6 overflow-hidden relative">
    
    <!-- Modern Centered Toast Notification -->
    <transition name="toast">
      <div v-if="errorMessage" class="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-md">
        <div class="bg-white text-danger px-6 py-4 rounded-2xl shadow-2xl border border-danger/20 flex items-center space-x-3 w-full animate-in slide-in-from-top-10">
          <div class="w-10 h-10 bg-danger/10 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle class="w-6 h-6 text-danger" />
          </div>
          <p class="text-sm font-semibold text-text leading-tight">{{ errorMessage }}</p>
        </div>
      </div>
    </transition>

    <!-- Main Container: Split Screen Design -->
    <div class="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative z-10 border border-slate-200">
      
      <!-- LEFT PANEL: Animated Moving Gradient & Branding -->
      <div class="w-full md:w-1/2 p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950">
        
        <!-- Animated Blobs / Moving Colors Background -->
        <div class="absolute inset-0 z-0">
          <div class="absolute -top-20 -left-20 w-80 h-80 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-60 animate-blob"></div>
          <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div class="absolute top-1/3 right-[-10%] w-72 h-72 bg-sky-500 rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>

        <div class="relative z-10">
          <div class="flex items-center space-x-3 mb-10">
            <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-1.5 shadow flex items-center justify-center">
              <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
            </div>
            <div>
              <span class="text-lg font-black tracking-tight">DEVELZY</span>
              <span class="text-xs text-yellow-400 font-extrabold block -mt-1 tracking-wider uppercase">ERP v2.1</span>
            </div>
          </div>

          <div class="space-y-6 mt-10">
            <h1 class="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
              SaaS Academic System & <br />
              <span class="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent font-black">AI School Ecosystem</span>
            </h1>
            <p class="text-sm text-blue-100/80 leading-relaxed max-w-sm">
              Sistem administrasi, raport digital kurikulum merdeka, pesantren, ujian CBT online, dan asisten guru kecerdasan buatan dalam satu platform.
            </p>
          </div>
        </div>

        <!-- Left Panel Footer -->
        <div class="relative z-10 mt-14 pt-6 border-t border-white/10 text-xs text-blue-200/60 flex items-center justify-between">
          <span>Multi-Tenant Platform</span>
          <span>TK, SD, SMP, SMA, SMK, Pesantren</span>
        </div>
      </div>

      <!-- RIGHT PANEL: Sleek Form with Floating Input Elements -->
      <div class="w-full md:w-1/2 p-10 md:p-14 bg-white flex flex-col justify-center">
        <div class="mb-8">
          <span class="text-xs text-primary font-bold uppercase tracking-wider">Silakan Masuk</span>
          <h2 class="text-3xl font-extrabold text-slate-900 mt-1">Log In</h2>
          <p class="text-xs text-slate-500 mt-1">Gunakan kredensial akun sekolah Anda untuk mengakses dashboard.</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email Input -->
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Alamat Email</label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail class="h-4 w-4 text-slate-400" />
              </div>
              <input
                v-model="email"
                type="email"
                required
                class="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                placeholder="superadmin@develzy.com"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi</label>
              <a href="#" class="text-xs text-primary font-semibold hover:underline">Lupa Kata Sandi?</a>
            </div>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock class="h-4 w-4 text-slate-400" />
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Log In Button with Gold Accent Hover -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-blue-900 to-indigo-950 hover:from-blue-800 hover:to-indigo-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-sm disabled:opacity-50 border border-transparent hover:border-yellow-400/20"
          >
            <span v-if="!isLoading" class="flex items-center">
              <LogIn class="w-4 h-4 mr-2" />
              Masuk ke Dashboard
            </span>
            <span v-else class="flex items-center">
              <span class="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
              Memproses Autentikasi...
            </span>
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span class="flex items-center">
            <ShieldCheck class="w-4 h-4 text-emerald-500 mr-1" />
            Keamanan SSL Terenkripsi
          </span>
          <span class="text-slate-400">Not a member? <a href="#" class="text-primary font-bold hover:underline">Hubungi Kami</a></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite alternate ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

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
</style>

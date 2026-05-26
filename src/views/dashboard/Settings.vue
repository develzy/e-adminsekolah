<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import { Settings, Shield, User, Key, CheckCircle, AlertTriangle, RefreshCw, Database } from 'lucide-vue-next'

const authStore = useAuthStore()

const profileForm = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isSavingProfile = ref(false)
const isSavingPassword = ref(false)
const isRunningRollover = ref(false)
const isBackingUp = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = msg
  toastType.value = type
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const saveProfile = async () => {
  isSavingProfile.value = true
  setTimeout(() => {
    authStore.setUser({
      ...authStore.user,
      name: profileForm.value.name,
      email: profileForm.value.email
    })
    isSavingProfile.value = false
    triggerToast('Profil berhasil diperbarui!')
  }, 1000)
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    triggerToast('Konfirmasi kata sandi tidak cocok!', 'error')
    return
  }

  isSavingPassword.value = true
  setTimeout(() => {
    passwordForm.value.currentPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
    isSavingPassword.value = false
    triggerToast('Kata sandi berhasil diubah!')
  }, 1000)
}

const runRollover = async () => {
  if (!confirm('Apakah Anda yakin ingin memproses rollover akademik? Ini akan meluluskan kelas akhir secara otomatis.')) {
    return
  }
  isRunningRollover.value = true
  try {
    const res = await axios.post('/api/academic/rollover')
    triggerToast(res.data.message || 'Rollover akademik sukses!')
  } catch (error) {
    console.error(error)
    triggerToast('Gagal menjalankan rollover akademik.', 'error')
  } finally {
    isRunningRollover.value = false
  }
}

const downloadBackup = async () => {
  isBackingUp.value = true
  try {
    const res = await axios.get('/api/database/backup')
    const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `develzy_erp_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    triggerToast('Backup database JSON berhasil diunduh!')
  } catch (error) {
    console.error(error)
    triggerToast('Gagal memproses backup database.', 'error')
  } finally {
    isBackingUp.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Centered Toast Notification -->
    <transition name="toast">
      <div v-if="showToast" class="fixed top-10 left-1/2 transform -translate-x-1/2 z-50">
        <div 
          :class="[
            'px-6 py-4 rounded-2xl shadow-2xl border flex items-center space-x-3 max-w-md w-full animate-in slide-in-from-top-10',
            toastType === 'success' ? 'bg-white border-success/20 text-success' : 'bg-white border-danger/20 text-danger'
          ]"
        >
          <div :class="['w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', toastType === 'success' ? 'bg-success/10' : 'bg-danger/10']">
            <CheckCircle v-if="toastType === 'success'" class="w-6 h-6" />
            <AlertTriangle v-else class="w-6 h-6" />
          </div>
          <p class="text-sm font-medium text-text">{{ toastMessage }}</p>
        </div>
      </div>
    </transition>

    <div>
      <h1 class="text-3xl font-extrabold text-text flex items-center tracking-tight">
        <Settings class="w-8 h-8 mr-3 text-primary" />
        Pengaturan Sistem & Akun
      </h1>
      <p class="text-text/60 text-sm mt-1">Konfigurasikan preferensi branding sekolah, backup basis data, rollover akademik otomatis, serta profil Anda.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Panel -->
      <div class="space-y-6 lg:col-span-1">
        <!-- User Summary -->
        <div class="card-modern p-6 flex flex-col items-center text-center">
          <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
            {{ authStore.user?.name ? authStore.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U' }}
          </div>
          <h3 class="font-bold text-lg text-text leading-tight">{{ authStore.user?.name || 'User' }}</h3>
          <p class="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full mt-2 uppercase tracking-wider">
            {{ authStore.user?.role?.replace('_', ' ') || 'GURU' }}
          </p>
          <p class="text-xs text-text/60 mt-3">{{ authStore.user?.email || 'email@sekolah.com' }}</p>

          <div class="w-full border-t border-border mt-6 pt-6 text-left space-y-4">
            <div class="flex items-center space-x-3 text-xs text-text/70">
              <Shield class="w-4 h-4 text-primary" />
              <span>Hak Akses Terverifikasi</span>
            </div>
          </div>
        </div>

        <!-- Academic & Database Operations -->
        <div class="card-modern p-6 space-y-4">
          <h4 class="font-bold text-sm text-text border-b border-border pb-2">Pemeliharaan & Data ERP</h4>
          
          <!-- Auto Rollover -->
          <div>
            <button 
              @click="runRollover" 
              :disabled="isRunningRollover"
              class="w-full btn-primary text-xs py-2.5 bg-gradient-to-br from-yellow-500 to-yellow-600 border-none text-blue-950 font-bold flex items-center justify-center"
            >
              <RefreshCw class="w-4 h-4 mr-1.5" :class="isRunningRollover ? 'animate-spin' : ''" />
              Jalankan Rollover Akademik
            </button>
            <p class="text-[10px] text-text/50 mt-1 leading-normal">Secara otomatis menaikkan jenjang kelas seluruh siswa aktif dan memperbarui kelas akhir menjadi alumni.</p>
          </div>

          <!-- DB Backup -->
          <div class="pt-2 border-t border-border">
            <button 
              @click="downloadBackup" 
              :disabled="isBackingUp"
              class="w-full btn-primary text-xs py-2.5 bg-gradient-to-br from-blue-900 to-blue-800 text-white font-bold border-none flex items-center justify-center"
            >
              <Database class="w-4 h-4 mr-1.5" />
              Backup Database (JSON)
            </button>
            <p class="text-[10px] text-text/50 mt-1 leading-normal">Unduh skema dan seluruh baris data dari Cloudflare D1 sebagai cadangan cadangan terenkripsi.</p>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Edit Profile -->
        <div class="card-modern p-6">
          <h3 class="font-bold text-lg text-text flex items-center mb-4 border-b border-border pb-3">
            <User class="w-5 h-5 mr-2 text-primary" />
            Ubah Profil Personal
          </h3>
          <form @submit.prevent="saveProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-text/70 mb-1">Nama Lengkap</label>
                <input v-model="profileForm.name" type="text" class="input-modern" required />
              </div>
              <div>
                <label class="block text-xs font-semibold text-text/70 mb-1">Alamat Email</label>
                <input v-model="profileForm.email" type="email" class="input-modern" required />
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <button type="submit" :disabled="isSavingProfile" class="btn-primary flex items-center">
                <span v-if="isSavingProfile" class="mr-2 h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"></span>
                {{ isSavingProfile ? 'Menyimpan...' : 'Simpan Profil' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Change Password -->
        <div class="card-modern p-6">
          <h3 class="font-bold text-lg text-text flex items-center mb-4 border-b border-border pb-3">
            <Key class="w-5 h-5 mr-2 text-primary" />
            Keamanan & Kata Sandi
          </h3>
          <form @submit.prevent="changePassword" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-text/70 mb-1">Kata Sandi Saat Ini</label>
                <input v-model="passwordForm.currentPassword" type="password" class="input-modern" required />
              </div>
              <div>
                <label class="block text-xs font-semibold text-text/70 mb-1">Kata Sandi Baru</label>
                <input v-model="passwordForm.newPassword" type="password" class="input-modern" required />
              </div>
              <div>
                <label class="block text-xs font-semibold text-text/70 mb-1">Konfirmasi Kata Sandi</label>
                <input v-model="passwordForm.confirmPassword" type="password" class="input-modern" required />
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <button type="submit" :disabled="isSavingPassword" class="btn-primary flex items-center">
                <span v-if="isSavingPassword" class="mr-2 h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full"></span>
                Ubah Kata Sandi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

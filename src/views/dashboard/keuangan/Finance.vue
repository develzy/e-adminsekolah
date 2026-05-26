<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { DollarSign, Plus, X, FileText, CheckCircle, Clock } from 'lucide-vue-next'

const students = ref<any[]>([])
const financeRecords = ref<any[]>([])
const isLoading = ref(false)
const showModal = ref(false)

const formFinance = ref({
  student_id: '',
  type: 'SPP',
  amount: 250000,
  date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  status: 'Lunas'
})

const fetchInitialData = async () => {
  try {
    const res = await axios.get('/api/students')
    students.value = res.data
  } catch (error) {
    console.error('Failed to load students:', error)
  }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('/api/finance')
    financeRecords.value = res.data
  } catch (error) {
    console.error('Failed to load finance data:', error)
  } finally {
    isLoading.value = false
  }
}

const submitFinance = async () => {
  try {
    await axios.post('/api/finance', formFinance.value)
    showModal.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

onMounted(() => {
  fetchInitialData()
  fetchData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5">
      <div>
        <h1 class="text-3xl font-extrabold text-text flex items-center tracking-tight">
          <DollarSign class="w-8 h-8 mr-3 text-primary" />
          Keuangan & SPP Digital
        </h1>
        <p class="text-text/60 text-sm mt-1">Kelola pencatatan SPP siswa, tagihan pembangunan, pengiriman invoice, dan rekap keuangan sekolah.</p>
      </div>
      <div>
        <button @click="showModal = true" class="btn-primary text-xs py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center">
          <Plus class="w-4 h-4 mr-1" /> Catat Transaksi Baru
        </button>
      </div>
    </div>

    <!-- Quick Stats Card -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card-modern p-5 flex items-center space-x-4 border-l-4 border-l-success">
        <div class="p-3 bg-success/10 text-success rounded-xl">
          <CheckCircle class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs text-text/50 uppercase font-bold">Total Pembayaran Lunas</span>
          <p class="font-extrabold text-lg text-text mt-1">
            {{ formatCurrency(financeRecords.filter(r => r.status === 'Lunas').reduce((acc, curr) => acc + curr.amount, 0)) }}
          </p>
        </div>
      </div>

      <div class="card-modern p-5 flex items-center space-x-4 border-l-4 border-l-danger">
        <div class="p-3 bg-danger/10 text-danger rounded-xl">
          <Clock class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs text-text/50 uppercase font-bold">Tunggakan Tertunda</span>
          <p class="font-extrabold text-lg text-text mt-1">
            {{ formatCurrency(financeRecords.filter(r => r.status === 'Belum Lunas').reduce((acc, curr) => acc + curr.amount, 0)) }}
          </p>
        </div>
      </div>

      <div class="card-modern p-5 flex items-center space-x-4 border-l-4 border-l-primary">
        <div class="p-3 bg-primary/10 text-primary rounded-xl">
          <FileText class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs text-text/50 uppercase font-bold">Total Entri Transaksi</span>
          <p class="font-extrabold text-lg text-text mt-1">{{ financeRecords.length }} Transaksi</p>
        </div>
      </div>
    </div>

    <!-- Transaction Table -->
    <div class="card-modern p-6">
      <h3 class="font-bold text-lg text-text mb-4">Jurnal Histori Pembayaran</h3>

      <div v-if="isLoading" class="p-8 text-center text-text/50">
        Loading financial logs...
      </div>
      <div v-else-if="financeRecords.length === 0" class="p-8 text-center text-text/40">
        Belum ada histori pembayaran tercatat. Klik "Catat Transaksi Baru" untuk memulai.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-border bg-background/50">
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Siswa</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Jenis Transaksi</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Jumlah Bayar</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Tanggal</th>
              <th class="p-3 text-xs font-bold text-text/70 uppercase">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="rec in financeRecords" :key="rec.id" class="hover:bg-background/40 transition-colors">
              <td class="p-3 text-sm font-semibold text-text">{{ rec.student_name || 'Siswa' }}</td>
              <td class="p-3 text-xs text-text/70 font-semibold uppercase text-primary">{{ rec.type }}</td>
              <td class="p-3 text-xs font-mono font-bold">{{ formatCurrency(rec.amount) }}</td>
              <td class="p-3 text-xs text-text/60">{{ rec.date }}</td>
              <td class="p-3 text-xs">
                <span class="px-2 py-0.5 rounded-full font-bold text-[10px]"
                  :class="rec.status === 'Lunas' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'"
                >
                  {{ rec.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showModal" class="fixed inset-0 bg-blue-950/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border animate-in zoom-in-95 duration-200">
        <div class="flex justify-between items-center border-b border-border pb-3 mb-4">
          <h3 class="font-extrabold text-lg text-text">Catat Keuangan Baru</h3>
          <button @click="showModal = false" class="text-text/50 hover:text-text">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitFinance" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Pilih Siswa</label>
            <select v-model="formFinance.student_id" class="input-modern" required>
              <option value="" disabled>-- Pilih Siswa --</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Tipe Pembayaran / Tagihan</label>
            <select v-model="formFinance.type" class="input-modern">
              <option>SPP Bulanan</option>
              <option>Uang Pembangunan</option>
              <option>Seragam & Kitab</option>
              <option>Kegiatan OSIS</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Jumlah (Rp)</label>
              <input v-model.number="formFinance.amount" type="number" class="input-modern" required />
            </div>
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Status</label>
              <select v-model="formFinance.status" class="input-modern">
                <option>Lunas</option>
                <option>Belum Lunas</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Tanggal Transaksi</label>
            <input v-model="formFinance.date" type="text" class="input-modern" required />
          </div>

          <button type="submit" class="w-full btn-primary mt-4 py-2 text-white bg-primary">Simpan Transaksi</button>
        </form>
      </div>
    </div>
  </div>
</template>

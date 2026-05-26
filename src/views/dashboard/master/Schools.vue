<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Search, Edit, Trash2, X, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-vue-next'
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  FlexRender
} from '@tanstack/vue-table'
import axios from 'axios'

// State
const schools = ref<any[]>([])
const isLoading = ref(true)
const globalFilter = ref('')
const sorting = ref<any[]>([])

// Modal State
const isModalOpen = ref(false)
const isEditing = ref(false)
const formData = ref({
  id: '',
  npsn: '',
  name: '',
  type: 'Negeri',
  level: 'SMA',
  address: '',
  status: 'active'
})

// Fetch Data
const fetchSchools = async () => {
  isLoading.value = true
  try {
    const { data } = await axios.get('/api/schools')
    schools.value = data
  } catch (error) {
    console.error('Error fetching schools:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSchools()
})

// Table Config
const columns = [
  {
    accessorKey: 'npsn',
    header: 'NPSN',
  },
  {
    accessorKey: 'name',
    header: 'Nama Sekolah',
    cell: (info: any) => info.getValue(),
  },
  {
    accessorKey: 'type',
    header: 'Tipe',
  },
  {
    accessorKey: 'level',
    header: 'Jenjang',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info: any) => info.getValue() === 'active' ? 'Aktif' : 'Non-Aktif',
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }: any) => row.original, // Handled in template
  }
]

const table = useVueTable({
  get data() { return schools.value },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  state: {
    get globalFilter() { return globalFilter.value },
    get sorting() { return sorting.value }
  },
  onGlobalFilterChange: (updater: any) => { globalFilter.value = typeof updater === 'function' ? updater(globalFilter.value) : updater },
  onSortingChange: (updater: any) => { sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater },
})

// Handlers
const openModal = (school?: any) => {
  if (school) {
    isEditing.value = true
    formData.value = { ...school }
  } else {
    isEditing.value = false
    formData.value = { id: '', npsn: '', name: '', type: 'Negeri', level: 'SMA', address: '', status: 'active' }
  }
  isModalOpen.value = true
}

const saveSchool = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/schools/${formData.value.id}`, formData.value)
    } else {
      await axios.post('/api/schools', formData.value)
    }
    isModalOpen.value = false
    fetchSchools()
  } catch (error) {
    console.error('Error saving school:', error)
    alert('Gagal menyimpan data')
  }
}

const deleteSchool = async (id: string) => {
  if (confirm('Yakin ingin menghapus sekolah ini?')) {
    try {
      await axios.delete(`/api/schools/${id}`)
      fetchSchools()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-text">Data Sekolah</h1>
        <p class="text-text/60 text-sm">Kelola data tenant sekolah di sistem</p>
      </div>
      <button @click="openModal()" class="btn-primary flex items-center space-x-2">
        <Plus class="w-5 h-5" />
        <span>Tambah Sekolah</span>
      </button>
    </div>

    <div class="card-modern p-6">
      <div class="flex justify-between items-center mb-6">
        <div class="relative w-64">
          <input
            v-model="globalFilter"
            type="text"
            placeholder="Cari sekolah..."
            class="input-modern pl-10"
          />
          <Search class="w-5 h-5 text-text/40 absolute left-3 top-2.5" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-background border-y border-border">
            <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <th 
                v-for="header in headerGroup.headers" 
                :key="header.id" 
                class="px-4 py-3 font-medium text-text/80 text-sm cursor-pointer select-none"
                @click="header.column.getToggleSortingHandler()?.($event)"
              >
                <div class="flex items-center space-x-1">
                  <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
                  <ChevronsUpDown v-if="header.column.getCanSort()" class="w-4 h-4 text-text/40" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border relative">
            <tr v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-surface/50 z-10">
              <td>Loading...</td>
            </tr>
            <tr v-for="row in table.getRowModel().rows" :key="row.id" class="hover:bg-background/50 transition-colors">
              <td class="px-4 py-4 text-sm text-text">{{ row.original.npsn }}</td>
              <td class="px-4 py-4 text-sm font-medium text-text">{{ row.original.name }}</td>
              <td class="px-4 py-4 text-sm text-text/80">{{ row.original.type }}</td>
              <td class="px-4 py-4 text-sm text-text/80 font-semibold">{{ row.original.level }}</td>
              <td class="px-4 py-4 text-sm">
                <span :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-full',
                  row.original.status === 'active' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                ]">
                  {{ row.original.status === 'active' ? 'Aktif' : 'Non-Aktif' }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm space-x-2">
                <button @click="openModal(row.original)" class="text-info hover:bg-info/10 p-1.5 rounded-lg transition-colors">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="deleteSchool(row.original.id)" class="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="!isLoading && schools.length === 0">
              <td colspan="6" class="text-center py-8 text-text/50">Belum ada data sekolah.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <span class="text-sm text-text/60">
          Menampilkan Halaman {{ table.getState().pagination.pageIndex + 1 }} dari {{ table.getPageCount() || 1 }}
        </span>
        <div class="flex space-x-2">
          <button 
            @click="table.previousPage()" 
            :disabled="!table.getCanPreviousPage()"
            class="p-2 rounded-lg border border-border text-text hover:bg-background disabled:opacity-50 transition-colors"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button 
            @click="table.nextPage()" 
            :disabled="!table.getCanNextPage()"
            class="p-2 rounded-lg border border-border text-text hover:bg-background disabled:opacity-50 transition-colors"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-surface w-full max-w-lg rounded-2xl p-6 shadow-xl relative border border-border animate-in fade-in zoom-in-95">
        <button @click="isModalOpen = false" class="absolute right-4 top-4 text-text/50 hover:text-text">
          <X class="w-5 h-5" />
        </button>
        
        <h2 class="text-xl font-bold text-text mb-6">{{ isEditing ? 'Edit Sekolah' : 'Tambah Sekolah Baru' }}</h2>
        
        <form @submit.prevent="saveSchool" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text mb-1">NPSN</label>
              <input v-model="formData.npsn" type="text" class="input-modern" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-text mb-1">Tipe</label>
              <select v-model="formData.type" class="input-modern" required>
                <option value="Negeri">Negeri</option>
                <option value="Swasta">Swasta</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">Nama Sekolah</label>
            <input v-model="formData.name" type="text" class="input-modern" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">Jenjang Sekolah</label>
            <select v-model="formData.level" class="input-modern" required>
              <option value="TK">TK (Taman Kanak-kanak)</option>
              <option value="SD">SD (Sekolah Dasar)</option>
              <option value="MI">MI (Madrasah Ibtidaiyah)</option>
              <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
              <option value="MTS">MTs (Madrasah Tsanawiyah)</option>
              <option value="SMA">SMA (Sekolah Menengah Atas)</option>
              <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
              <option value="MA">MA (Madrasah Aliyah)</option>
              <option value="PONDOK PESANTREN">Pondok Pesantren</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">Status</label>
            <select v-model="formData.status" class="input-modern" required>
              <option value="active">Aktif</option>
              <option value="inactive">Non-Aktif</option>
            </select>
          </div>
          
          <div class="pt-4 flex justify-end space-x-3">
            <button type="button" @click="isModalOpen = false" class="px-4 py-2 rounded-lg font-medium text-text bg-background border border-border hover:bg-border/50 transition-colors">Batal</button>
            <button type="submit" class="btn-primary py-2 px-6">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

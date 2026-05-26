<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Search, Edit, Trash2, X, ChevronLeft, ChevronRight, ChevronsUpDown, Download, Upload } from 'lucide-vue-next'
import {
  useVueTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  FlexRender
} from '@tanstack/vue-table'
import axios from 'axios'
import * as XLSX from 'xlsx'

// State
const teachers = ref<any[]>([])
const isLoading = ref(true)
const globalFilter = ref('')
const sorting = ref<any[]>([])

// Modal State
const isModalOpen = ref(false)
const isEditing = ref(false)
const formData = ref({
  id: '',
  nip: '',
  nuptk: '',
  name: '',
  gender: 'L',
  phone: '',
  status: 'aktif'
})

// Fetch Data
const fetchTeachers = async () => {
  isLoading.value = true
  try {
    const { data } = await axios.get('/api/teachers')
    teachers.value = data
  } catch (error) {
    console.error('Error fetching teachers:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTeachers()
})

// Import/Export Data
const fileInput = ref<HTMLInputElement | null>(null)

const triggerImport = () => {
  fileInput.value?.click()
}

const handleImport = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (evt) => {
    try {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

      for (const row of jsonData) {
        const payload = {
          nip: String(row['NIP'] || ''),
          nuptk: String(row['NUPTK'] || ''),
          name: String(row['Nama Lengkap'] || row['Nama'] || ''),
          gender: String(row['L/P'] || 'L').toUpperCase() === 'P' ? 'P' : 'L',
          phone: String(row['Telepon'] || ''),
          status: 'aktif'
        }
        await axios.post('/api/teachers', payload)
      }
      fetchTeachers()
      alert('Data guru berhasil di-import!')
    } catch (err) {
      console.error(err)
      alert('Gagal meng-import excel. Periksa format file Anda.')
    } finally {
      if (fileInput.value) fileInput.value.value = ''
    }
  }
  reader.readAsArrayBuffer(file)
}

const exportToExcel = () => {
  if (teachers.value.length === 0) return alert('Tidak ada data untuk diekspor')
  const worksheet = XLSX.utils.json_to_sheet(teachers.value.map(t => ({
    NIP: t.nip,
    NUPTK: t.nuptk,
    'Nama Lengkap': t.name,
    'L/P': t.gender,
    Telepon: t.phone,
    Status: t.status
  })))
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Guru")
  XLSX.writeFile(workbook, "Data_Guru.xlsx")
}

// Table Config
const columns = [
  {
    accessorKey: 'nip',
    header: 'NIP',
  },
  {
    accessorKey: 'nuptk',
    header: 'NUPTK',
  },
  {
    accessorKey: 'name',
    header: 'Nama Lengkap',
  },
  {
    accessorKey: 'gender',
    header: 'L/P',
  },
  {
    accessorKey: 'phone',
    header: 'Telepon',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info: any) => info.getValue() === 'aktif' ? 'Aktif' : 'Non-Aktif',
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: ({ row }: any) => row.original, // Handled in template
  }
]

const table = useVueTable({
  get data() { return teachers.value },
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
const openModal = (teacher?: any) => {
  if (teacher) {
    isEditing.value = true
    formData.value = { ...teacher }
  } else {
    isEditing.value = false
    formData.value = { id: '', nip: '', nuptk: '', name: '', gender: 'L', phone: '', status: 'aktif' }
  }
  isModalOpen.value = true
}

const saveTeacher = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`/api/teachers/${formData.value.id}`, formData.value)
    } else {
      await axios.post('/api/teachers', formData.value)
    }
    isModalOpen.value = false
    fetchTeachers()
  } catch (error) {
    console.error('Error saving teacher:', error)
    alert('Gagal menyimpan data')
  }
}

const deleteTeacher = async (id: string) => {
  if (confirm('Yakin ingin menghapus data guru ini?')) {
    try {
      await axios.delete(`/api/teachers/${id}`)
      fetchTeachers()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-text">Data Guru</h1>
        <p class="text-text/60 text-sm">Kelola data tenaga pendidik</p>
      </div>
      <div class="flex items-center space-x-2">
        <input type="file" ref="fileInput" accept=".xlsx, .xls" class="hidden" @change="handleImport" />
        <button @click="triggerImport" class="btn-primary bg-surface text-text border border-border hover:bg-background shadow-none">
          <Upload class="w-4 h-4 mr-2 inline-block" /> Import
        </button>
        <button @click="exportToExcel" class="btn-primary bg-surface text-text border border-border hover:bg-background shadow-none">
          <Download class="w-4 h-4 mr-2 inline-block" /> Export
        </button>
        <button @click="openModal()" class="btn-primary flex items-center space-x-2">
          <Plus class="w-5 h-5" />
          <span>Tambah Guru</span>
        </button>
      </div>
    </div>

    <div class="card-modern p-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div class="relative w-full md:w-80">
          <input
            v-model="globalFilter"
            type="text"
            placeholder="Cari nama atau NIP..."
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
              <td class="px-4 py-4 text-sm text-text">{{ row.original.nip }}</td>
              <td class="px-4 py-4 text-sm text-text">{{ row.original.nuptk }}</td>
              <td class="px-4 py-4 text-sm font-medium text-text">{{ row.original.name }}</td>
              <td class="px-4 py-4 text-sm text-text/80">{{ row.original.gender }}</td>
              <td class="px-4 py-4 text-sm text-text/80">{{ row.original.phone }}</td>
              <td class="px-4 py-4 text-sm">
                <span :class="[
                  'px-2.5 py-1 text-xs font-medium rounded-full',
                  row.original.status === 'aktif' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                ]">
                  {{ row.original.status === 'aktif' ? 'Aktif' : 'Non-Aktif' }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm space-x-2">
                <button @click="openModal(row.original)" class="text-info hover:bg-info/10 p-1.5 rounded-lg transition-colors">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="deleteTeacher(row.original.id)" class="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="!isLoading && teachers.length === 0">
              <td colspan="7" class="text-center py-8 text-text/50">Belum ada data guru.</td>
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
        
        <h2 class="text-xl font-bold text-text mb-6">{{ isEditing ? 'Edit Data Guru' : 'Tambah Guru Baru' }}</h2>
        
        <form @submit.prevent="saveTeacher" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text mb-1">NIP</label>
              <input v-model="formData.nip" type="text" class="input-modern" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text mb-1">NUPTK</label>
              <input v-model="formData.nuptk" type="text" class="input-modern" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">Nama Lengkap & Gelar</label>
            <input v-model="formData.name" type="text" class="input-modern" required />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text mb-1">Jenis Kelamin</label>
              <select v-model="formData.gender" class="input-modern" required>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-text mb-1">Telepon/WhatsApp</label>
              <input v-model="formData.phone" type="text" class="input-modern" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1">Status</label>
            <select v-model="formData.status" class="input-modern" required>
              <option value="aktif">Aktif</option>
              <option value="cuti">Cuti</option>
              <option value="pensiun">Pensiun</option>
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

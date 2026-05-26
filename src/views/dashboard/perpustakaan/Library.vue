<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { BookOpen, Plus, X, Search, Bookmark } from 'lucide-vue-next'

const books = ref<any[]>([])
const search = ref('')
const isLoading = ref(false)
const showModal = ref(false)

const formBook = ref({
  title: '',
  author: '',
  isbn: '',
  stock: 5
})

const fetchData = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('/api/library')
    books.value = res.data
  } catch (error) {
    console.error('Failed to load library books:', error)
  } finally {
    isLoading.value = false
  }
}

const submitBook = async () => {
  try {
    await axios.post('/api/library', formBook.value)
    showModal.value = false
    formBook.value = { title: '', author: '', isbn: '', stock: 5 }
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5">
      <div>
        <h1 class="text-3xl font-extrabold text-text flex items-center tracking-tight">
          <BookOpen class="w-8 h-8 mr-3 text-primary" />
          Perpustakaan & E-Book
        </h1>
        <p class="text-text/60 text-sm mt-1">Katalog buku perpustakaan digital, peminjaman buku, dan bacaan e-book siswa online.</p>
      </div>
      <div>
        <button @click="showModal = true" class="btn-primary text-xs py-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold border-none flex items-center">
          <Plus class="w-4 h-4 mr-1" /> Tambah Buku Baru
        </button>
      </div>
    </div>

    <!-- Search bar -->
    <div class="card-modern p-4 flex items-center space-x-3 bg-white">
      <Search class="w-5 h-5 text-text/40" />
      <input v-model="search" type="text" placeholder="Cari judul buku, penulis atau kode ISBN..." class="bg-transparent border-none outline-none text-sm w-full text-text placeholder-text/30" />
    </div>

    <!-- Catalog Grid -->
    <div v-if="isLoading" class="p-8 text-center text-text/50">
      Loading library books...
    </div>
    <div v-else-if="books.length === 0" class="p-8 text-center text-text/40">
      Belum ada buku dalam katalog. Klik "Tambah Buku Baru" untuk memulai.
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="book in books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))" :key="book.id" class="card-modern p-5 bg-gradient-to-br from-surface to-background border border-border hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-center space-x-2 text-primary">
            <Bookmark class="w-5 h-5 text-accent" />
            <span class="text-[10px] uppercase font-bold tracking-wider text-text/40">ISBN: {{ book.isbn || '-' }}</span>
          </div>
          <h3 class="font-extrabold text-base text-text mt-2 leading-snug">{{ book.title }}</h3>
          <p class="text-xs text-text/60 mt-1">Penulis: <span class="font-semibold">{{ book.author || 'Tidak Diketahui' }}</span></p>
        </div>

        <div class="mt-4 pt-3 border-t border-border/60 flex justify-between items-center">
          <span class="text-xs text-text/50">Stok: <span class="font-bold text-text">{{ book.stock }} Eks</span></span>
          <button class="btn-primary text-[10px] py-1 px-3 bg-primary/10 text-primary border-none hover:bg-primary/20">Pinjam Buku</button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showModal" class="fixed inset-0 bg-blue-950/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border animate-in zoom-in-95 duration-200">
        <div class="flex justify-between items-center border-b border-border pb-3 mb-4">
          <h3 class="font-extrabold text-lg text-text">Tambah Buku Perpustakaan</h3>
          <button @click="showModal = false" class="text-text/50 hover:text-text">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="submitBook" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Judul Buku</label>
            <input v-model="formBook.title" type="text" class="input-modern" placeholder="e.g. Laskar Pelangi" required />
          </div>

          <div>
            <label class="block text-xs font-semibold text-text/70 mb-1">Penulis / Pengarang</label>
            <input v-model="formBook.author" type="text" class="input-modern" placeholder="e.g. Andrea Hirata" required />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">ISBN</label>
              <input v-model="formBook.isbn" type="text" class="input-modern" placeholder="e.g. 978-602-291-662-7" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-text/70 mb-1">Jumlah Stok</label>
              <input v-model.number="formBook.stock" type="number" class="input-modern" required />
            </div>
          </div>

          <button type="submit" class="w-full btn-primary mt-4 py-2 text-white bg-primary">Simpan Buku</button>
        </form>
      </div>
    </div>
  </div>
</template>

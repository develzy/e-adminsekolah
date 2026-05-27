import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard-home',
          component: () => import('@/views/dashboard/Overview.vue')
        },
        // Master Data
        {
          path: 'schools',
          name: 'schools',
          component: () => import('@/views/dashboard/master/Schools.vue')
        },
        {
          path: 'students',
          name: 'students',
          component: () => import('@/views/dashboard/master/Students.vue')
        },
        {
          path: 'teachers',
          name: 'teachers',
          component: () => import('@/views/dashboard/master/Teachers.vue')
        },
        // Akademik
        {
          path: 'academic',
          name: 'academic',
          component: () => import('@/views/dashboard/akademik/Academic.vue')
        },
        {
          path: 'penilaian',
          name: 'penilaian',
          component: () => import('@/views/dashboard/akademik/Penilaian.vue')
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/views/dashboard/akademik/Raport.vue')
        },
        // AI Education
        {
          path: 'ai/bank-soal',
          name: 'ai-bank-soal',
          component: () => import('@/views/dashboard/ai/BankSoal.vue')
        },
        // CBT Online
        {
          path: 'cbt',
          name: 'cbt-online',
          component: () => import('@/views/dashboard/cbt/CbtOnline.vue')
        },
        // Kesiswaan
        {
          path: 'kesiswaan',
          name: 'kesiswaan',
          component: () => import('@/views/dashboard/kesiswaan/Kesiswaan.vue')
        },
        // Pesantren
        {
          path: 'pesantren',
          name: 'pesantren',
          component: () => import('@/views/dashboard/pesantren/Pesantren.vue')
        },
        // Parent Portal
        {
          path: 'parent',
          name: 'parent-portal',
          component: () => import('@/views/dashboard/parent/ParentPortal.vue')
        },
        // SMK Center
        {
          path: 'smk',
          name: 'smk-center',
          component: () => import('@/views/dashboard/smk/SmkCenter.vue')
        },
        // Keuangan
        {
          path: 'finance',
          name: 'finance',
          component: () => import('@/views/dashboard/keuangan/Finance.vue')
        },
        // Perpustakaan
        {
          path: 'library',
          name: 'library',
          component: () => import('@/views/dashboard/perpustakaan/Library.vue')
        },
        // WhatsApp Center
        {
          path: 'whatsapp',
          name: 'whatsapp-center',
          component: () => import('@/views/dashboard/whatsapp/WaCenter.vue')
        },
        // Settings
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/dashboard/Settings.vue')
        },
        // And more to be added later
      ]
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth && !token) {
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && token) {
    next({ name: 'dashboard-home' });
  } else {
    next();
  }
});

export default router

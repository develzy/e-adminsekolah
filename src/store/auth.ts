import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as any,
    token: localStorage.getItem('token') || null,
    school: null as any
  }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    setUser(user: any) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    setSchool(school: any) {
      this.school = school
    },
    logout() {
      this.token = null
      this.user = null
      this.school = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})

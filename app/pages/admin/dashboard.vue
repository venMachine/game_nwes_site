<template>
  <div>
    <h1>Панель управления</h1>
    <p>Добро пожаловать, {{ user?.username }}</p>
    <nav>
      <NuxtLink to="/admin/articles">Управление статьями</NuxtLink>
    </nav>
    <button @click="logout">Выйти</button>
    
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const user = JSON.parse(localStorage.getItem('user') || '{}')

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  navigateTo('/admin/login')
}
</script>
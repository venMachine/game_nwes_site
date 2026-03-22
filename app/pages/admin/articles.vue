<template>
  <div class="admin-articles">
    <h1>Управление статьями</h1>
    <NuxtLink to="/admin/news" class="btn-create">+ Новая статья</NuxtLink>

    <div v-if="pending">Загрузка...</div>
    <div v-else-if="articles.length" class="articles-list">
      <div v-for="article in articles" :key="article.id" class="article-row">
        <div class="article-info">
          <h3>{{ article.title }}</h3>
          <p>{{ article.excerpt }}</p>
          <small>ID: {{ article._id }} / Slug: {{ article.slug }}</small>
        </div>
        <div class="article-actions">
          <NuxtLink :to="`/admin/${article.slug}`" class="btn-edit">✏️</NuxtLink>
          <button @click="deleteArticle(article.slug)" class="btn-delete">🗑️</button>
        </div>
      </div>
    </div>
    <div v-else>Статей пока нет.</div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const { data: articles, pending, refresh } = await useFetch(`${config.public.apiBaseUrl}/articles`)

const deleteArticle = async (slug) => {
  if (!confirm('Удалить статью?')) return
  try {
    const token = localStorage.getItem('token')
    await $fetch(`${config.public.apiBaseUrl}/articles/${slug}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    refresh()
  } catch (err) {
    alert('Ошибка при удалении')
  }
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.article-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba($primary, 0.05);
  border-radius: $border-radius-lg;
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: $text-secondary;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid rgba($primary, 0.2);
    border-radius: $border-radius;
    background: $secondary;
    color: $text-primary;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: $primary;
    }
  }

  textarea {
    resize: vertical;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox {
  display: flex;
  align-items: center;
  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  input {
    width: auto;
  }
}

button {
  background: $primary;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: $border-radius;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:hover:not(:disabled) {
    background: color-mix(in srgb, $primary, white 10%);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
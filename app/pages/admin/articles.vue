<template>
  <div class="admin-articles">
    <h1>Управление статьями</h1>
    <NuxtLink to="/admin/news" class="btn-create">+ Новая статья</NuxtLink>

    <div v-if="pending">Загрузка...</div>
    <div v-else-if="articles.length" class="articles-list">
      <div v-for="article in articles" :key="article.id" class="article-row">
      <div class="article-info">
          <h3>
            {{ article.title }}
            <span v-if="article.published_to_yandex" class="badge-yandex" title="Отправлено в Яндекс.Новости">Я</span>
            <span v-if="article.published_to_google" class="badge-google" title="Отправлено в Google News">G</span>
          </h3>
          <p>{{ article.excerpt }}</p>
          <small>ID: {{ article._id }} / Slug: {{ article.slug }}</small>
        </div>
        <div class="article-actions">
          <NuxtLink :to="`/admin/${article.slug}`" class="btn-edit">✏️</NuxtLink>
          <button @click="deleteArticle(article.slug)" class="btn-delete">🗑️</button>
           <button 
            @click="publishToYandex(article.slug)" 
            class="btn-yandex" 
            title="Отправить в Яндекс.Новости"
            :disabled="publishing === article.slug"
          >
            {{ publishing === article.slug ? 'Отправка...' : ' Яндекс' }}
          </button>
          <button 
            @click="publishToGoogle(article.slug)" 
            class="btn-google" 
            title="Отправить в Google News"
            :disabled="publishing === article.slug"
          >
            {{ publishing === article.slug ? 'Отправка...' : ' Google' }}
          </button>
        </div>
      </div>
    </div>
    <div v-else>Статей пока нет.</div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const config = useRuntimeConfig()
const publishing = ref(null)
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
const publishToYandex = async (slug) => {
  publishing.value = slug
  try {
    const token = localStorage.getItem('token')  
    await $fetch(`${config.public.apiBaseUrl}/articles/publish-yandex`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { slug }
    })
    alert(`Статья "${slug}" отправлена в Яндекс.Новости`)
  } catch (err) {
    alert('Ошибка при отправке в Яндекс.Новости')
    console.error(err)
  } finally {
    publishing.value = null
  }
}

const publishToGoogle = async (slug) => {
  publishing.value = slug
  try {
    const token = localStorage.getItem('token')   
    await $fetch(`${config.public.apiBaseUrl}/articles/publish-google`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { slug }
    })
    alert(`Статья "${slug}" отправлена в Google News`)
  } catch (err) {
    alert('Ошибка при отправке в Google News')
    console.error(err)
  } finally {
    publishing.value = null
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
.btn-yandex, .btn-google {
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-yandex {
  color: #fc3f1d;
}
.btn-yandex:hover:not(:disabled) {
  background: rgba(252, 63, 29, 0.1);
}

.btn-google {
  color: #4285f4;
}
.btn-google:hover:not(:disabled) {
  background: rgba(66, 133, 244, 0.1);
}

.btn-yandex:disabled, .btn-google:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.admin-articles {
  background: #101A23;
  min-height: 100vh;
  padding: 2rem;
  border-radius: $border-radius-lg;
}


.article-row {
  background: rgba(255, 255, 255, 0.05);
  border-radius: $border-radius;
  margin-bottom: 1rem;
  padding: 1rem;
}

.articles-list {
  background: transparent;
}
.badge-yandex, .badge-google {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  margin-left: 8px;
  vertical-align: middle;
}

.badge-yandex {
  background: #fc3f1d;
  color: white;
}

.badge-google {
  background: #4285f4;
  color: white;
}
</style>
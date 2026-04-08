<template>
  <div class="category-page">
    <h1 class="page-title">Киберспорт</h1>

    <div v-if="!loading && articlesList.length" class="news-grid">
      <ArticleCard
        v-for="article in articlesList"
        :key="article.id"
        :article="article"
      />
    </div>
    <div v-else-if="loading" class="loading">Загрузка...</div>
    <div v-else class="no-news">Новостей пока нет</div>

    <div v-if="hasMore" class="load-more">
      <button @click="loadMore" :disabled="loading" class="load-more__btn">
        {{ loading ? 'Загрузка...' : 'Показать ещё' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const config = useRuntimeConfig()
const currentPage = ref(1)
const limit = 12
const allArticles = ref([])
const totalPages = ref(1)
const loading = ref(false)

const loadArticles = async () => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/articles`, {
      params: {
        page: currentPage.value,
        limit: limit,
        category: 'esports'
      }
    })
    const newArticles = res.data || []
    
    if (currentPage.value === 1) {
      allArticles.value = newArticles
    } else {
      allArticles.value = [...allArticles.value, ...newArticles]
    }
    totalPages.value = res.totalPages || 1
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const articlesList = computed(() => allArticles.value)
const hasMore = computed(() => currentPage.value < totalPages.value)

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++
    loadArticles()
  }
}

await loadArticles()

useSeoMeta({
  title: 'BarracudaGame - Киберспорт',
  description: 'Новости киберспорта, турниры, результаты матчей',
  ogTitle: 'BarracudaGame - Киберспорт',
  ogDescription: 'Свежие новости из мира киберспорта',
  ogImage: '/og-image.jpg',
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.category-page {
  padding: 2rem 0;
  
  @media (max-width: 768px) {
    padding: 1rem 0;
  }
}

.page-title {
  text-align: center;
  color: $primary;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
}

.news-grid {
  @include grid(3, 1.5rem);
  
  @media (max-width: 992px) {
    @include grid(2, 1.25rem);
  }
  
  @media (max-width: 768px) {
    @include grid(2, 1rem);
  }
  
  @media (max-width: 576px) {
    @include grid(1, 1rem);
  }
}

.loading, .no-news {
  text-align: center;
  padding: 3rem;
  color: $text-muted;
  background: rgba($primary, 0.05);
  border-radius: $border-radius;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
}
</style>

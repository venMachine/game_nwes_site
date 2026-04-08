<template>
  <div class="news-list-page">
    <h1 class="page-title">Все новости</h1>

    <div class="categories" v-if="categories.length">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        class="categories__btn"
        :class="{ 'categories__btn--active': activeCategory === cat.slug }"
        @click="filterByCategory(cat.slug)"
      >
        {{ cat.name }}
      </button>
    </div>

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

<script setup>
import { ref, computed, watch } from 'vue'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const categories = [
  { id: 0, name: 'Все', slug: 'all' },
  { id: 1, name: 'Киберспорт', slug: 'esports' },
  { id: 2, name: 'Консоли', slug: 'consoles' },
  { id: 3, name: 'Рейтинги', slug: 'ratings' },
  { id: 4, name: 'VR/AR', slug: 'vr-ar' },
  { id: 5, name: 'Инди-игры', slug: 'indie' },
  { id: 6, name: 'Компьютерные игры', slug: 'pc-games' }
]

const activeCategory = ref(route.query.category || 'all')
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
        category: activeCategory.value
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

const filterByCategory = (slug) => {
  activeCategory.value = slug
  currentPage.value = 1
  router.replace({ query: { category: slug !== 'all' ? slug : undefined } })
  loadArticles()
}


watch(activeCategory, () => {
  currentPage.value = 1
  loadArticles()
}, { immediate: true })
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.news-list-page {
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


.categories {
  @include flex(row, center, center);
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
}

.categories__btn {
  background: rgba($primary, 0.1);
  border: 1px solid rgba($primary, 0.2);
  color: $text-primary;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba($primary, 0.2);
    border-color: $primary;
  }
  
  &--active {
    background: $primary;
    color: white;
    border-color: $primary;
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.8rem;
    font-size: 0.75rem;
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

.load-more {
  text-align: center;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    margin-top: 2rem;
  }
}

.load-more__btn {
  background: transparent;
  border: 2px solid $primary;
  color: $primary;
  padding: 0.75rem 2rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: $primary;
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
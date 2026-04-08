<template>
  <div class="home">
    <section class="hero">
      <div class="hero__content">
        <h1 class="hero__title">Barracuda</h1>
        <p class="hero__subtitle">
          Самые свежие новости из мира видеоигр, киберспорта и гейминга
        </p>
      </div>
    </section>

    <div class="categories">
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

    <div class="two-columns">
      <div v-if="featuredArticle" class="featured-column">
        <ArticleCard :article="featuredArticle" featured />
      </div>
      <aside class="sidebar">
        <NewsFeed />
      </aside>
    </div>

    <div v-if="articlesToShow.length" class="news-grid">
      <ArticleCard
        v-for="article in articlesToShow"
        :key="article.id"
        :article="article"
      />
    </div>
    <div v-else-if="!loading" class="no-news">
      <p>Новостей пока нет. Скоро добавим!</p>
    </div>
    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-if="hasMore" class="load-more">
      <button @click="loadMore" :disabled="loading" class="load-more__btn">
        {{ loading ? 'Загрузка...' : 'Показать ещё' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Article } from '~/components/ArticleCard.vue'
import NewsFeed from '~/components/NewsFeed.vue'

const config = useRuntimeConfig()

const categories = [
  { id: 0, name: 'Все', slug: 'all' },
  { id: 1, name: 'Киберспорт', slug: 'esports' },
  { id: 2, name: 'Консоли', slug: 'consoles' },
  { id: 3, name: 'Рейтинги', slug: 'ratings' },
  { id: 4, name: 'VR/AR', slug: 'vr-ar' },
  { id: 5, name: 'Инди-игры', slug: 'indie' },
  { id: 6, name: 'Компьютерные игры', slug: 'pc-games' }
]

const activeCategory = ref('all')
const currentPage = ref(1)
const limit = 12
const allArticles = ref<Article[]>([])
const totalPages = ref(1)
const loading = ref(false)


const { data: allData } = await useFetch<{ data: Article[] }>(
  () => `${config.public.apiBaseUrl}/articles?limit=1000&category=${activeCategory.value}`
)

const allArticlesForFeatured = computed(() => {
  if (!allData.value?.data) return []
  return [...allData.value.data].sort((a, b) => 
    new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
  )
})

const featuredArticle = computed(() => allArticlesForFeatured.value.find(a => a.isFeatured === true))


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
    console.log('newArticles IDs:', newArticles.map(a => a.id))
    console.log('featuredArticle.value?.id:', featuredArticle.value?.id)
    
  
    const filtered = newArticles
    
    if (currentPage.value === 1) {
      allArticles.value = filtered
    } else {
      allArticles.value = [...allArticles.value, ...filtered]
    }
    totalPages.value = res.totalPages || 1
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
const articlesToShow = computed(() => allArticles.value)
const hasMore = computed(() => currentPage.value < totalPages.value)

const loadMore = () => {
  if (hasMore.value && !loading.value) {
    currentPage.value++
    loadArticles()
  }
}

const filterByCategory = (slug: string) => {
  activeCategory.value = slug
  currentPage.value = 1
  loadArticles()
}

await loadArticles()

useSeoMeta({
  title: 'BarracudaGame - Главная страница',
  description: 'Самые свежие новости из мира видеоигр, киберспорта и гейминга',
  ogTitle: 'BarracudaGame - Игровые новости',
  ogDescription: 'Ежедневные обновления игрового мира',
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image'
})
</script>




<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.home {
  padding-bottom: 3rem;
}

.hero {
  background: linear-gradient(
      135deg,
      rgba(15, 25, 35, 0.95) 0%,
      rgba(255, 70, 85, 0.2) 100%
    ),
    url('https://res.cloudinary.com/dztn4jtdc/image/upload/v1775146102/photo-1511512578047-dfb367046420_c84nu2.avif');
  background-size: cover;
  background-position: center;
  border-radius: $border-radius-lg;
  padding: 4rem 2rem;
  margin-bottom: 2rem;
  text-align: center;
  border: 1px solid #101A23;
}

.hero__title {
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  word-break: break-word;
  hyphens: auto;
  @include media('md') { font-size: 2.5rem; }
  @include media('sm') { font-size: 2rem; }
}

.hero__subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.categories {
  @include flex(row, center, center);
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.categories__btn {
  background: #101A23;
  border: 1px solid rgba($primary, 0.2);
  color: $text-primary;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
   
    border-color: $primary;
  }
  &--active {
    background: $primary;
    color: white;
    border-color: $primary;
    &:hover {
      background: color-mix(in srgb, $primary, white 10%);
    }
  }
}


.two-columns {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
}

.featured-column {
  flex: 2;
  min-width: 0;
}

.sidebar {
  flex: 1;
  min-width: 280px;
  max-height: 600px;
  overflow-y: auto;
  scrollbar-width: thin;
  
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba($primary, 0.1);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba($primary, 0.3);
    border-radius: 3px;
  }
}


.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}

.no-news {
  text-align: center;
  padding: 3rem;
  color: $text-muted;
  background: rgba($primary, 0.05);
  border-radius: $border-radius;
  border: 1px dashed rgba($primary, 0.2);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: $text-secondary;
}

.load-more {
  text-align: center;
  margin-top: 3rem;
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
}
</style>
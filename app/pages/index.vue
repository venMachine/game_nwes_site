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

    <!-- Выделенная новость (Новость дня) -->
    <div v-if="featuredArticle" class="featured-wrapper">
      <ArticleCard :article="featuredArticle" featured />
    </div>

    <!-- Сетка остальных новостей -->
    <div v-if="otherArticlesLimited.length" class="news-grid">
      <ArticleCard
        v-for="article in otherArticlesLimited"
        :key="article.id"
        :article="article"
      />
    </div>
    <div v-else-if="!pending && !featuredArticle && !otherArticlesLimited.length" class="no-news">
      <p>Новостей пока нет. Скоро добавим!</p>
    </div>
    <div v-if="pending" class="loading">Загрузка...</div>

    <div v-if="hasMore" class="load-more">
      <button @click="loadMore" class="load-more__btn">
        Показать ещё
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
import type { Article } from '~/components/ArticleCard.vue'

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
const visibleCount = ref(12)

const { data: articles, pending,  refresh } = await useFetch<Article[]>(
  () => `${config.public.apiBaseUrl}/articles?limit=100&category=${activeCategory.value}`
)

const sortedArticles = computed(() => {
  if (!articles.value) return []
  return [...articles.value].sort((a, b) => 
    new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
  )
})

const featuredArticle = computed(() => sortedArticles.value.find(a => a.isFeatured))
const otherArticles = computed(() => sortedArticles.value.filter(a => a !== featuredArticle.value))
const otherArticlesLimited = computed(() => otherArticles.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < otherArticles.value.length)

const filterByCategory = (slug: string) => {
  activeCategory.value = slug
  visibleCount.value = 12
    refresh() 
}

const loadMore = () => {
  visibleCount.value += 6
}
onMounted(() => {
  refresh()
})
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
    url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  border-radius: $border-radius-lg;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.hero__title {
  font-size: 3rem;
  color: white;
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
    &:hover {
      background: color-mix(in srgb, $primary, white 10%);
    }
  }
}

.featured-wrapper {
  margin-bottom: 2rem;
  width: 100%;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
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
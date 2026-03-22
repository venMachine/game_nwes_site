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

    
    <div v-if="filteredArticles.length" class="news-grid">
      <ArticleCard 
        v-for="article in filteredArticles" 
        :key="article.id" 
        :article="article"
        :featured="article.isFeatured"
      />
    </div>
    <div v-else class="no-news">
      <p>Новостей пока нет. Скоро добавим!</p>
    </div>

    
    <div v-if="hasMore" class="load-more">
      <button @click="loadMore" class="load-more__btn">
        Показать ещё
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  refreshNuxtData()


const config = useRuntimeConfig();
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
const visibleCount = ref(6) 
const hasMore = computed(() => visibleCount.value < articles.value.length)

const { data: articles } = await useFetch<Article[]>(
  () => `${config.public.apiBaseUrl}/articles?limit=20&category=${activeCategory.value}`
)

const filteredArticles = computed(() => {
  let filtered = articles.value
  
  if (activeCategory.value !== 'all') {
    filtered = filtered.filter(
      article => article.category?.slug === activeCategory.value
    )
  }
  
  return filtered.slice(0, visibleCount.value)
})


const filterByCategory = (slug: string) => {
  activeCategory.value = slug
  visibleCount.value = 9 // сброс пагинации
}

const loadMore = () => {
  visibleCount.value += 3
}


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

/* Hero секция */
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
  padding: 4rem 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.hero__title {
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  word-break: break-word; 
  hyphens: auto; 
  @include media('md') {
    font-size: 2.5rem;
  }
  @include media('sm') {
    font-size: 2rem;
  }
}

.hero__subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Фильтр категорий */
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

/* Сетка новостей */
.news-grid {
  @include grid(1, 1rem); 
  
  @include media('md') { // от 768px
    @include grid(2, 1.25rem);
  }
  
  @include media('lg') { // от 992px
    @include grid(3, 1.5rem);
  }
}

/* Нет новостей */
.no-news {
  text-align: center;
  padding: 3rem;
  color: $text-muted;
  background: rgba($primary, 0.05);
  border-radius: $border-radius;
  border: 1px dashed rgba($primary, 0.2);
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
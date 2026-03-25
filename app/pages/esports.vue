<template>
  <div class="category-page">
    <!-- <AdBanner /> -->
    <h1 class="page-title">Киберспорт</h1>

    <div v-if="!pending && articles.length" class="news-grid">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />
    </div>
    <div v-else-if="pending" class="loading">Загрузка...</div>
    <div v-else class="no-news">Новостей пока нет</div>
  </div>
</template>

<script setup lang="ts">
  refreshNuxtData()
const config = useRuntimeConfig()

const { data: articles, pending } = await useFetch(
  `${config.public.apiBaseUrl}/articles?category=esports&limit=50`
)

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

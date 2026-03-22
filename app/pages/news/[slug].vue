<template>
  <div v-if="pending" class="loading">Загрузка...</div>
  <div v-else-if="article" class="article-page">
    <header class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span class="article-category">{{ article.category?.name || 'Игры' }}</span>
        <span class="article-date">{{ formatDate(article.publishedAt || article.createdAt) }}</span>
        <span class="article-views">👁 {{ formatViews(article.views || 0) }}</span>
      </div>
    </header>

    <NuxtImg
      v-if="article.image"
      :src="article.image"
      :alt="article.title"
      class="article-image"
      width="1200"
      height="630"
      loading="lazy"
    />

    <div class="article-content" v-html="article.content"></div>

    
    <ShareButtons 
      :title="article.title" 
      :url="shareUrl" 
    />

   
    <!-- <AdBanner /> -->

    <div v-if="article.tags?.length" class="article-tags">
      <span v-for="tag in article.tags" :key="tag" class="tag">#{{ tag }}</span>
    </div>
  </div>
  <div v-else class="not-found">Статья не найдена</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Article } from '~/components/ArticleCard.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

const config = useRuntimeConfig()
const route = useRoute()


const { data: article, pending } = await useFetch<Article>(
  () => `${config.public.apiBaseUrl}/articles/${route.params.slug}`
)


const formatDate = (dateString: string) => {
  const date = dayjs(dateString)
  dayjs.locale('ru')
  if (date.isSame(dayjs(), 'day')) return `Сегодня, ${date.format('HH:mm')}`
  if (date.isSame(dayjs().subtract(1, 'day'), 'day')) return `Вчера, ${date.format('HH:mm')}`
  return date.format('D MMMM YYYY')
}


const formatViews = (views: number) => {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M'
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K'
  return views.toString()
}


const shareUrl = computed(() => `${config.public.siteUrl}/news/${article.value?.slug}`)


useSeoMeta({
  title: () => article.value?.title || 'Статья',
  description: () => article.value?.excerpt || '',
  ogTitle: () => article.value?.title,
  ogDescription: () => article.value?.excerpt,
  ogImage: () => article.value?.image,
  ogUrl: () => shareUrl.value
})
useHead({
  link: [
    {
      rel: 'canonical',
      href: shareUrl.value
    }
  ]
})


useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.value?.title,
        description: article.value?.excerpt,
        image: article.value?.image,
        datePublished: article.value?.publishedAt || article.value?.createdAt,
        author: {
          '@type': 'Person',
          name: article.value?.author?.name || 'GameNews'
        },
        publisher: {
          '@type': 'Organization',
          name: 'GameNews',
          logo: {
            '@type': 'ImageObject',
            url: `${config.public.siteUrl}/logo.png`
          }
        }
      })
    }
  ]
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.article-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.article-header {
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
}

.article-title {
  font-size: 2.5rem;
  color: $primary;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: $text-secondary;
  font-size: 0.9rem;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    font-size: 0.8rem;
  }
}

.article-category {
  background: rgba($primary, 0.2);
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  white-space: nowrap;
}

.article-image {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: $border-radius-lg;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    max-height: 350px;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    max-height: 250px;
    margin-bottom: 1rem;
  }
}

.article-content {
  line-height: 1.8;
  color: $text-primary;
  
  h2 {
    font-size: 1.8rem;
    margin: 1.5rem 0;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  h3 {
    @media (max-width: 768px) {
      font-size: 1.3rem;
    }
  }
  
  p {
    margin: 1rem 0;
    
    @media (max-width: 480px) {
      font-size: 0.95rem;
    }
  }
  
  img {
    max-width: 100%;
    border-radius: $border-radius;
  }
}

.article-tags {
  margin-top: 2rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  .tag {
    background: rgba($primary, 0.1);
    padding: 0.2rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    
    @media (max-width: 480px) {
      font-size: 0.7rem;
      padding: 0.2rem 0.6rem;
    }
  }
}

.loading, .not-found {
  text-align: center;
  padding: 3rem;
  color: $text-muted;
}
</style>
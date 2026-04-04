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
 
    <div v-if="article.author" class="author-block">
  <div class="author-avatar">
    <img 
      :src="`/authors/author-${article.author.id}.jpg`" 
      :alt="article.author.name"
      @error="e => e.target.src = '/authors/default-avatar.png'"
    />
  </div>
  <div class="author-info">
    <h3>Автор: {{ article.author.name }}</h3>
    <p class="author-bio">{{ article.author.bio || 'Нет дополнительной информации' }}</p>
  </div>
  <div class="telegram-link">
   <a :href="config.public.telegramChannelUrl" target="_blank" rel="noopener noreferrer" class="tg-button-icon" aria-label="Telegram-канал">
  <font-awesome-icon :icon="['fab', 'telegram']" />
</a>
  </div>
</div>



    <div class="article-content" v-html="article.content"></div>

    
    <ShareButtons 
      :title="article.title" 
      :url="shareUrl" 
    />

   
    <!-- <AdBanner /> -->

    <div v-if="article.tags?.length" class="article-tags">
      <span v-for="tag in article.tags" :key="tag" class="tag">#{{ tag }}</span>
    </div>
  <div v-if="relatedArticles.length" class="related-articles">
  <h2 class="related-title">Читайте также</h2>
    <div class="related-grid">
    <ArticleCard 
      v-for="article in relatedArticles" 
      :key="article.id" 
      :article="article" 
    />
       </div>
     </div>
  </div>
  <div v-else class="not-found">Статья не найдена</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Article } from '~/components/ArticleCard.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

const config = useRuntimeConfig()
const route = useRoute()


const slug = route.params.slug as string
if (!slug) {
  throw createError({ statusCode: 404, statusMessage: 'Страница не найдена' })
}

const { data: article, pending, error } = await useFetch<Article>(
  () => `${config.public.apiBaseUrl}/articles/${slug}`
)

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Статья не найдена' })
}

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

const { data: related } = await useFetch(
  () => `${config.public.apiBaseUrl}/articles?category=${article.value?.category?.slug || ''}&limit=4`
)

const relatedArticles = computed(() => {
  if (!related.value) return []
  return related.value.filter((a: Article) => a.slug !== slug).slice(0, 3)
})

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
  ],
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
          name: article.value?.author?.name || 'BarracudaGame'
        },
        publisher: {
          '@type': 'Organization',
          name: 'BarracudaGame',
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
@use '~/assets/scss/mixins' as *;
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
  font-size: 1.5rem;
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

.author-block {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba($primary, 0.05);
  border-radius: $border-radius;
  border-left: 3px solid $primary;
}

.author-info {
  margin-bottom: 1rem;
  h3 {
    color: $primary;
    margin-bottom: 0.5rem;
  }
  .author-bio {
    font-size: 0.9rem;
    color: $text-secondary;
    line-height: 1.5;
  }
}

.telegram-link {
  text-align: right;
  .tg-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: #26A5E4;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 24px;
    text-decoration: none;
    font-size: 0.9rem;
    transition: background 0.2s;
    &:hover {
      background: #1f8fc9;
    }
  }
}
.related-articles {
  margin-top: 3rem;
}

.related-title {
  font-size: 1.5rem;
  color: $primary;
  margin-bottom: 1.5rem;
  position: relative;
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: $primary;
    margin-top: 0.5rem;
  }
}

.related-grid {
  @include grid(3, 1.5rem);
  @include media('md') {
    @include grid(2, 1rem);
  }
  @include media('sm') {
    @include grid(1, 1rem);
  }
}
.author-block {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: .5rem;
  background: rgba($primary, 0.05);
  border-radius: $border-radius;
  border-left: 3px solid $primary;
}

.author-avatar {
  flex-shrink: 0;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  background: $secondary;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.author-info {
  flex: 1;
}

.telegram-link {
  flex-shrink: 0;
}

.tg-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #26A5E4;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 24px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s;

  &:hover {
    background: #1f8fc9;
  }
}
.tg-button-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #26A5E4;
  border-radius: 50%;
  color: white;
  transition: background 0.2s;

  &:hover {
    background: #1f8fc9;
  }

  svg {
    font-size: 1.2rem;
  }
}
.related-articles {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba($primary, 0.05);
  border-radius: $border-radius;

  h3 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .related-grid {
      grid-template-columns: 1fr; /* одна колонка на мобильных */
      gap: 0.75rem;
    }

    h3 {
      font-size: 1.2rem;
    }
  }
}
.article-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #101A23;  /* Новый фон */
  border-radius: $border-radius-lg;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
}
</style>
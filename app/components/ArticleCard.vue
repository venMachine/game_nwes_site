<template>
  <article class="article-card" :class="{ 'article-card--featured': featured }">
 
    <NuxtLink :to="`/news/${article.slug}`" class="article-card__link">
      
      
      <div class="article-card__image">
        <NuxtImg
          :src="article.image"
          :alt="article.title"
          :width="featured ? 768 : 400"
          :height="featured ? 432 : 225"
          loading="lazy"
          fit="cover"
          format="webp"
          class="article-card__img"
        />
        
        
            <span class="article-card__category">
            {{ article.category?.name || 'Игры' }}
          </span>

          
          <span v-if="article.isFeatured && !featured" class="article-card__featured">
            ⭐
          </span>

         
          <span v-if="featured" class="article-card__badge">
            🌟 Новость дня
          </span>
      </div>

     
      <div class="article-card__content">
        <h3 class="article-card__title">
          {{ article.title }}
        </h3>
        
        <p class="article-card__excerpt">
          {{ article.excerpt }}
        </p>
        
       
        <div class="article-card__meta">
          <div class="article-card__author">
            <span class="article-card__author-avatar">👤</span>
            <span>{{ article.author?.name || 'GameNews' }}</span>
          </div>
          
          <div class="article-card__stats">
            <time class="article-card__date">
              {{ formatDate(article.publishedAt || article.createdAt) }}
            </time>
            <span class="article-card__views">
              👁 {{ formatViews(article.views || 0) }}
            </span>
          </div>
        </div>
        
        <!-- Теги -->
        <div v-if="article.tags?.length" class="article-card__tags">
          <span 
            v-for="tag in article.tags.slice(0, 3)" 
            :key="tag"
            class="article-card__tag"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/ru'


export interface Article {
  id: number | string
  slug: string
  title: string
  excerpt: string
  image: string
  category?: {
    id: number
    name: string
    slug: string
  }
  author?: {
    id: number
    name: string
    avatar?: string,
    bio?: String
  }
  publishedAt?: string
  createdAt: string
  views?: number
  tags?: string[]
  isFeatured?: boolean
}


const props = defineProps<{
  article: Article
  featured?: boolean
}>()


const formatDate = (dateString: string) => {
  const date = dayjs(dateString)
  const now = dayjs()
  dayjs.locale('ru')
  
  
  if (date.isSame(now, 'day')) {
    return `Сегодня, ${date.format('HH:mm')}`
  }
  
  if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return `Вчера, ${date.format('HH:mm')}`
  }
  
  if (now.diff(date, 'day') < 7) {
    return date.format('dddd, HH:mm') 
  }
 
  return date.format('D MMMM YYYY')
}


const formatViews = (views: number) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M'
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K'
  }
  return views.toString()
}
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.article-card {
  background: rgba($secondary, 0.5);
  border-radius: $border-radius-lg;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba($primary, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(5px);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-lg;
    border-color: rgba($primary, 0.3);
    
    .article-card__img {
      transform: scale(1.05);
    }
    
    .article-card__title {
      color: $primary;
    }
  }
  
  &--featured {
    @include media('lg') {
      grid-column: span 2;
      
      .article-card__image {
        height: 350px;
      }
      
      .article-card__title {
        font-size: 1.75rem;
      }
    }
  }
}

.article-card__link {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-decoration: none;
  color: inherit;
}

.article-card__image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: $secondary;
}

.article-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card__category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: $primary;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
}

.article-card__featured {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba($dark, 0.8);
  color: gold;
  padding: 0.5rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  @include flex(row, center, center);
  font-size: 1.1rem;
  backdrop-filter: blur(2px);
  z-index: 2;

}

.article-card__content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: linear-gradient(
    to bottom,
    rgba($secondary, 0.8),
    $secondary
  );
}

.article-card__title {
  font-size: 1.2rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  color: $text-primary;
  @include text-truncate(2);
  transition: color 0.3s ease;
}

.article-card__excerpt {
  color: $text-secondary;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
  flex-grow: 1;
  @include text-truncate(3);
}

.article-card__meta {
  @include flex(row, space-between, center);
  margin-bottom: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba($text-muted, 0.2);
  font-size: 0.85rem;
}

.article-card__author {
  @include flex(row, flex-start, center);
  gap: 0.5rem;
  color: $text-secondary;
  
  &-avatar {
    font-size: 0.9rem;
  }
}

.article-card__stats {
  @include flex(row, flex-start, center);
  gap: 0.75rem;
  color: $text-muted;
}

.article-card__date {
  font-style: italic;
}

.article-card__views {
  @include flex(row, flex-start, center);
  gap: 0.2rem;
}

.article-card__tags {
  @include flex(row, flex-start, center);
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.article-card__tag {
  background: rgba($primary, 0.08);
  color: $text-secondary;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba($primary, 0.2);
    color: $text-primary;
  }
}

.article-card__badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: $primary;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  z-index: 2;
  backdrop-filter: blur(4px);
}
</style>
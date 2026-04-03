<template>
  <div class="news-feed">
    <h2 class="feed-title"> Новостная лента</h2>
    <div v-if="pending" class="loading">Загрузка...</div>
    <div v-else-if="newsFeed.length" class="feed-list">
      <div v-for="item in newsFeed" :key="item._id" class="feed-item">
        <NuxtLink :to="`/news/${item.slug}`" class="feed-link">
          <!-- <span class="feed-badge" :class="{ 'yandex': item.published_to_yandex, 'google': item.published_to_google }">
  {{ item.published_to_yandex && item.published_to_google ? '🌟' : item.published_to_yandex ? 'Я' : 'G' }}
</span> -->
          <span class="feed-title-text">{{ item.title }}</span>
          <span class="feed-date">{{ formatDate(item.publishedAt || item.createdAt) }}</span>
        </NuxtLink>
      </div>
    </div>
    <div v-else class="empty-feed">Новостей в ленте пока нет</div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

const config = useRuntimeConfig();

const { data: newsFeed, pending } = await useFetch(
  `${config.public.apiBaseUrl}/articles?published_to_news=true&limit=15`
);

const formatDate = (dateString) => {
  const date = dayjs(dateString);
  dayjs.locale('ru');
  if (date.isSame(dayjs(), 'day')) return `Сегодня, ${date.format('HH:mm')}`;
  if (date.isSame(dayjs().subtract(1, 'day'), 'day')) return `Вчера, ${date.format('HH:mm')}`;
  return date.format('D MMMM YYYY');
};
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.news-feed {
  background: #101A23;  
  border-radius: $border-radius-lg;
  padding: 1.5rem;
  margin: 0; 
  border: 1px solid rgba(255, 70, 85, 0.1);
  backdrop-filter: blur(5px);
}

.feed-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: $primary;
  border-bottom: 1px solid rgba(108, 117, 125, 0.2);
  padding-bottom: 1rem;

}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feed-item {
  border-bottom: 1px solid rgba($text-muted, 0.2);
  padding-bottom: 0.5rem;
  
  &:last-child {
    border-bottom: none;
  }
}

.feed-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: $text-primary;
  transition: color 0.2s;
  
  &:hover {
    color: $primary;
  }
}

.feed-badge {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: bold;
  
  &.yandex {
    background: #fc3f1d;
    color: white;
  }
  
  &.google {
    background: #4285f4;
    color: white;
  }
}

.feed-title-text {
   flex: 1;
  font-size: 1rem;
  font-weight: 600;
  transition: color 0.2s;
  white-space: normal;      
  word-break: break-word;  
  line-height: 1.3;

}

.feed-date {
  font-size: 0.75rem;
  color: $text-muted;
}

.loading, .empty-feed {
  text-align: center;
  padding: 2rem;
  color: $text-muted;
}
</style>
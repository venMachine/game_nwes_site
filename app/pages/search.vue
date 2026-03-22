<template>
  <div class="search-page">
    <h1 class="search-page__title">Поиск новостей</h1>

    
    <div class="search-form">
      <input
        v-model="query"
        type="text"
        placeholder="Введите запрос..."
        class="search-form__input"
        @keyup.enter="performSearch"
      />
      <button class="search-form__btn" @click="performSearch">
        Найти
      </button>
    </div>

    
    <div v-if="loading" class="search-loading">
      <p>Загрузка...</p>
    </div>

    <div v-else-if="results.length" class="search-results">
      <h2 class="search-results__title">Найдено статей: {{ results.length }}</h2>
      <div class="search-results__grid">
        <ArticleCard
          v-for="article in results"
          :key="article.id"
          :article="article"
        />
      </div>
    </div>

    <div v-else-if="query && !loading" class="search-no-results">
      <p>По запросу «{{ query }}» ничего не найдено.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
//import articlesData from '~/mock/articles.json'
import type { Article } from '~/components/ArticleCard.vue'

const route = useRoute()
const router = useRouter()


const query = ref('')
const results = ref<Article[]>([])
const loading = ref(false)


onMounted(() => {
  if (route.query.q) {
    query.value = route.query.q as string
    performSearch() 
  }
})


const performSearch = async () => {
  const trimmed = query.value.trim()
  

  if (!trimmed) {
    results.value = []
    router.replace({ query: {} })
    return
  }

  
  router.replace({ query: { q: trimmed } })

  loading.value = true

    try {
    const { data } = await useFetch<Article[]>(
      `${config.public.apiBaseUrl}/articles/search?q=${encodeURIComponent(trimmed)}`
    )
    results.value = data.value || []
     // const searchTerm = trimmed.toLowerCase()
  // results.value.filter(article => {
  //   return (
  //     article.title.toLowerCase().includes(searchTerm) ||
  //     article.excerpt.toLowerCase().includes(searchTerm) ||
  //     article.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  //   )
  // })

  } catch (err) {
    console.error('Ошибка поиска:', err)
    results.value = []
  } finally {
    loading.value = false
  }




}


const debounce = (fn, delay) => {
  let timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(), delay)
  }
}

const debouncedSearch = debounce(performSearch, 300)

watch(query, () => {
  debouncedSearch()
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.search-page {
  padding: 2rem 0;
}

.search-page__title {
  color: $primary;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.search-form {
  display: flex;
  max-width: 600px;
  margin: 0 auto 3rem;
  gap: 0.5rem;

  &__input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid rgba($primary, 0.2);
    border-radius: $border-radius;
    background: rgba($secondary, 0.8);
    color: $text-primary;
    font-size: 1rem;
    outline: none;

    &:focus {
      border-color: $primary;
    }
  }

  &__btn {
    padding: 0 2rem;
    background: $primary;
    color: white;
    border: none;
    border-radius: $border-radius;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;

    &:hover {
      background: color-mix(in srgb, $primary, black 10%);
    }
  }
}

.search-loading {
  text-align: center;
  color: $text-secondary;
  padding: 3rem;
}

.search-results__title {
  color: $text-primary;
  margin-bottom: 2rem;
}

.search-results__grid {
  @include grid(3, 1.5rem);

  @include media('lg') {
    @include grid(2, 1rem);
  }

  @include media('sm') {
    @include grid(1, 1rem);
  }
}

.search-no-results {
  text-align: center;
  padding: 3rem;
  color: $text-muted;
  background: rgba($primary, 0.05);
  border-radius: $border-radius;
  border: 1px dashed rgba($primary, 0.2);
}
</style>
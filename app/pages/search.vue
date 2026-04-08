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

    <div v-else-if="allResults.length" class="search-results">
      <h2 class="search-results__title">Найдено статей: {{ allResults.length }}</h2>
      <div class="search-results__grid">
        <ArticleCard
          v-for="article in displayedResults"
          :key="article.id"
          :article="article"
        />
      </div>
    </div>

    <div v-else-if="query && !loading" class="search-no-results">
      <p>По запросу «{{ query }}» ничего не найдено.</p>
    </div>

    <div v-if="hasMore && allResults.length" class="load-more">
      <button @click="loadMore" :disabled="loading" class="load-more__btn">
        {{ loading ? 'Загрузка...' : 'Показать ещё' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Article } from '~/components/ArticleCard.vue'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const query = ref('')
const allResults = ref<Article[]>([])
const loading = ref(false)
const visibleCount = ref(12)

const performSearch = async () => {
  const trimmed = query.value.trim()
  
  if (!trimmed) {
    allResults.value = []
    router.replace({ query: {} })
    return
  }

  router.replace({ query: { q: trimmed } })
  loading.value = true
  visibleCount.value = 12

  try {
    const data = await $fetch<Article[]>(
      `${config.public.apiBaseUrl}/articles/search?q=${encodeURIComponent(trimmed)}`
    )
    allResults.value = data || []
  } catch (err) {
    console.error('Ошибка поиска:', err)
    allResults.value = []
  } finally {
    loading.value = false
  }
}

const displayedResults = computed(() => allResults.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < allResults.value.length)

const loadMore = () => {
  visibleCount.value += 6
}

const debounce = (fn: Function, delay: number) => {
  let timeout: NodeJS.Timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(), delay)
  }
}

const debouncedSearch = debounce(performSearch, 300)

watch(query, () => {
  debouncedSearch()
})

onMounted(() => {
  if (route.query.q) {
    query.value = route.query.q as string
    performSearch()
  }
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

.search-no-results {
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

@media (max-width: 768px) {
  .search-page {
    padding: 1rem;
  }

  .search-page__title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .search-form {
    flex-direction: column;
    gap: 0.75rem;
  }

  .search-form__input {
    border-radius: $border-radius;
    border-right: 2px solid rgba($primary, 0.3);
  }

  .search-form__btn {
    border-radius: $border-radius;
    width: 100%;
    height: 2rem;
  }

  .search-results__grid {
    grid-template-columns: 1fr;
  }
}
</style>
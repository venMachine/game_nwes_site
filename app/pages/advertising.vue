<template>
  <div class="advertising-page">
    <h1 class="page-title">Реклама на BarracudaGame</h1>
    
    <section class="ad-section">
      <h2>Почему стоит размещать рекламу у нас</h2>
      <p>Аудитория BarracudaGame — это тысячи активных геймеров, интересующихся новинками индустрии, киберспортом и технологиями. Мы предлагаем эффективные форматы для охвата вашей целевой аудитории.</p>
    </section>

    <section class="ad-section">
      <h2>Форматы рекламы</h2>
      <div class="formats-grid">
        <div class="format-card">
          <h3>📰 Медийная реклама</h3>
          <p>Баннеры в шапке, сайдбаре и между статьями. Доступны размеры 728×90, 300×250, 160×600.</p>
        </div>
        <div class="format-card">
          <h3>📝 Нативные статьи</h3>
          <p>Экспертные материалы, написанные нашей редакцией, которые органично вписываются в контент сайта.</p>
        </div>
        <div class="format-card">
          <h3>🎮 Спонсорство турниров</h3>
          <p>Поддержка киберспортивных событий, интервью с игроками, прямые включения.</p>
        </div>
        <div class="format-card">
          <h3>📧 E-mail рассылка</h3>
          <p>Размещение информации в нашей еженедельной рассылке по базе подписчиков.</p>
        </div>
      </div>
    </section>

    <section class="ad-section">
      <h2>Контакты для сотрудничества</h2>
      <p>По всем вопросам обращайтесь на <a href="mailto:u272511@yandex.ru">u272511@yandex.ru</a> или через форму на странице <NuxtLink to="/contacts">контактов</NuxtLink>.</p>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Реклама на BaracudaGame',
  description: 'Разместите рекламу на BarracudaGame и привлеките тысячи активных геймеров. Баннеры, нативные статьи, спонсорство турниров — все форматы для вашего бизнеса.'
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.advertising-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
}

.page-title {
  color: $primary;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
}

.ad-section {
  margin-bottom: 3rem;
  
  h2 {
    color: $primary;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
  }
  
  p {
    line-height: 1.7;
    color: $text-primary;
    font-size: 1.1rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.95rem;
    }
    
    a {
      color: $primary;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.formats-grid {
  @include grid(2, 2rem);
  
  @media (max-width: 768px) {
    @include grid(1, 1.5rem);
  }
}

.format-card {
  background: rgba($primary, 0.05);
  border: 1px solid rgba($primary, 0.1);
  border-radius: $border-radius-lg;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  h3 {
    color: $primary;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
  
  p {
    font-size: 1rem;
    margin: 0;
    
    @media (max-width: 768px) {
      font-size: 0.95rem;
    }
  }
}
</style>
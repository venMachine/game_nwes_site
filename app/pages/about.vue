<template>
  <div class="about-page">
    <h1 class="page-title">О нас</h1>
    
    <section class="about-section">
      <h2>Кто мы</h2>
      <p>BarracudaGame — это ваш главный источник свежих новостей из мира видеоигр, киберспорта и индустрии развлечений. Мы  и ежедневно публикуем самые актуальные материалы.</p>
    </section>

    <section class="about-section">
      <h2>Наша миссия</h2>
      <p>Мы стремимся быть связующим звеном между игроками и игровой индустрией, предоставляя объективную, быструю и интересную информацию. Для нас важен каждый читатель, и мы постоянно развиваемся, чтобы делать контент ещё лучше.</p>
    </section>

    <section class="about-section">
      <h2>Что мы предлагаем</h2>
      <ul>
        <li>🔥 Горячие новости о релизах, обновлениях и событиях</li>
        <li>📊 Аналитические статьи и обзоры</li>
        <li>🏆 Репортажи с киберспортивных турниров</li>
        <li>🎮 Видео и стримы с экспертами</li>
      </ul>
    </section>

    <section class="about-section">
      <h2>Наша команда</h2>
      <p>За проектом стоят увлечённые геймеры, журналисты и разработчики, которые живут играми и хотят делиться этой страстью с вами.</p>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'О нас - BarracudaGame',
  description: 'Узнайте больше о команде BaracudaGame, нашей миссии и ценностях. Мы делаем игровые новости доступными и интересными.'
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;

.about-page {
  max-width: 800px;
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
    margin-bottom: 1rem;
  }
}

.about-section {
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
  
  h2 {
    color: $primary;
    margin-bottom: 1rem;
    font-size: 1.8rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
    }
    
    @media (max-width: 480px) {
      font-size: 1.3rem;
    }
  }
  
  p {
    line-height: 1.7;
    color: $text-primary;
    font-size: 1.1rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
      line-height: 1.6;
    }
    
    @media (max-width: 480px) {
      font-size: 0.95rem;
    }
  }
  
  ul {
    list-style: disc;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.5rem;
      line-height: 1.7;
      color: $text-primary;
      
      @media (max-width: 768px) {
        font-size: 0.95rem;
      }
    }
  }
}
</style>
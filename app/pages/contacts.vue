<template>
  <div class="contacts-page">
    <h1 class="page-title">Контакты</h1>
    
    <section class="contacts-section">
      <h2>Напишите нам</h2>
      <div class="contacts-info">
        <div class="contact-item">
          <span class="contact-icon">📧</span>
          <div>
            <strong>E-mail</strong>
            <p><a href="mailto:u272511@yandex.ru">u272511@yandex.ru</a></p>
          </div>
        </div>

       
      </div>
    </section>

    <section class="contacts-section">
      <h2>Социальные сети</h2>
      <div class="social-links">
        <a href="https://t.me/news_barracuda" target="_blank" rel="noopener" class="social-link">Telegram</a>

      </div>
    </section>


  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Контакты - BarracudaGame',
  description: 'Свяжитесь с нами по любым вопросам: сотрудничество, реклама, поддержка. E-mail, телефон, социальные сети и адрес.'
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.contacts-page {
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
  }
}

.contacts-section {
  margin-bottom: 3rem;
  
  h2 {
    color: $primary;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 1rem;
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
    }
    
    @media (max-width: 480px) {
      font-size: 0.95rem;
    }
  }
  
  a {
    color: $primary;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

.contacts-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  
  .contact-icon {
    font-size: 1.8rem;
    min-width: 2.5rem;
    text-align: center;
    
    @media (max-width: 480px) {
      font-size: 1.5rem;
      min-width: 2rem;
    }
  }
  
  strong {
    display: block;
    margin-bottom: 0.25rem;
    color: $text-primary;
  }
  
  p {
    margin: 0;
  }
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  
  .social-link {
    background: rgba($primary, 0.1);
    padding: 0.5rem 1.2rem;
    border-radius: 20px;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:hover {
      background: $primary;
      color: white;
    }
    
    @media (max-width: 480px) {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
    }
  }
}
</style>
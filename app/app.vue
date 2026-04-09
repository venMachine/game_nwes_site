<template>
  <div class="app">
    
    <header class="header">
      <div class="container">
        <div class="header__inner">
          
          <div class="logo">
            <NuxtLink to="/" class="logo__link">
              <NuxtImg 
                src="/logo-B.png" 
                alt="GameNews" 
                class="logo__image" 
                width="42" 
                height="42"
                format="webp"
                loading="eager"
              />
              <span class="logo__text">{{ $t('site_name') }}</span>
            </NuxtLink>
          </div>

          <button class="hamburger" @click="menuOpen = !menuOpen" :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'">
            <span class="hamburger__line" :class="{ 'hamburger__line--open': menuOpen }"></span>
            <span class="hamburger__line" :class="{ 'hamburger__line--open': menuOpen }"></span>
            <span class="hamburger__line" :class="{ 'hamburger__line--open': menuOpen }"></span>
          </button>

          <nav class="nav" :class="{ 'nav--open': menuOpen }">
            <ul class="nav__list">
              <li class="nav__item">
                <NuxtLink to="/" class="nav__link" active-class="nav__link--active" @click="menuOpen = false">
                  {{ $t('nav.home') }}
                </NuxtLink>
              </li>
              <li class="nav__item">
                <NuxtLink to="/news" class="nav__link" active-class="nav__link--active" @click="menuOpen = false">
                  {{ $t('nav.news') }}
                </NuxtLink>
              </li>
              <li class="nav__item">
                <NuxtLink to="/games" class="nav__link" active-class="nav__link--active" @click="menuOpen = false">
                  {{ $t('nav.games') }}
                </NuxtLink>
              </li>
              <li class="nav__item">
                <NuxtLink to="/esports" class="nav__link" active-class="nav__link--active" @click="menuOpen = false">
                  {{ $t('nav.esports') }}
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <div class="header__actions">
            
            <div class="language-switcher">
              <button 
                v-for="locale in availableLocales" 
                :key="locale.code"
                @click="switchLocale(locale.code)"
                :class="{ active: locale.code === currentLocale }"
              >
                {{ locale.name }}
              </button>
            </div>
            <a 
              :href="config.public.telegramChannelUrl" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="telegram-link"
              aria-label="Telegram канал"
            >
              <font-awesome-icon :icon="['fab', 'telegram']" />
            </a>
            <div class="search">
              <NuxtLink to="/search" class="search__btn">
                <span class="search__icon">🔍</span>
              </NuxtLink> 
            </div>
          </div>

        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <NuxtPage />
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <div class="footer__inner">
          <div class="footer__info">
            <h3 class="footer__title">{{ $t('site_name') }}</h3>
            <p class="footer__text">{{ $t('site_description') }}</p>
          </div>
          <div class="footer__links">
            <NuxtLink to="/about" class="footer__link">{{ $t('footer.about') }}</NuxtLink>
            <NuxtLink to="/advertising" class="footer__link">{{ $t('footer.advertising') }}</NuxtLink>
            <NuxtLink to="/contacts" class="footer__link">{{ $t('footer.contacts') }}</NuxtLink>
          </div>
          <div class="footer__copyright">
            <p>&copy; {{ new Date().getFullYear() }} {{ $t('site_name') }}. {{ $t('footer.copyright') }}</p>
            <p>© Илья Говорухин</p>
            <p class="footer__disclaimer">{{ $t('footer.disclaimer') || 'Все торговые марки принадлежат их правообладателям.' }}</p>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, locales, setLocale } = useI18n()
const config = useRuntimeConfig()
const menuOpen = ref(false)

const currentLocale = computed(() => locale.value)
const availableLocales = computed(() => locales.value.filter(i => i.code !== locale.value))

const switchLocale = (code: string) => {
  setLocale(code)
}

useHead({
  script: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-G66TBEFS9H',
      async: true,
      defer: true
    },
    {
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-G66TBEFS9H');
      `,
      type: 'text/javascript'
    },
    {
      innerHTML: `
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=108322152', 'ym');
      `,
      type: 'text/javascript'
    }
  ]
})

onMounted(() => {
  setTimeout(() => {
    if (typeof ym !== 'undefined') {
      ym(108322152, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
      });
    }
  }, 1000);
});
</script>

<style scoped lang="scss">
@use '~/assets/scss/variables' as *;
@use '~/assets/scss/mixins' as *;

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: black;
  border-bottom: 1px solid rgba($primary, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.header__inner {
  @include flex(row, space-between, center);
  position: relative;
  flex-wrap: wrap;
}

.logo__link {
  @include flex(row, flex-start, center);
  color: $primary;
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
  
  &:hover {
    color: color-mix(in srgb, $primary, white 10%);
  }
}

.logo__icon {
  margin-right: 0.5rem;
  font-size: 2rem;
}

.logo__text {
  @media (max-width: 480px) {
    display: none; 
  }
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  
  &__line {
    width: 100%;
    height: 3px;
    background-color: $text-primary;
    transition: transform 0.3s ease, opacity 0.3s ease;
    
    &--open {
      &:nth-child(1) {
        transform: translateY(9px) rotate(45deg);
      }
      &:nth-child(2) {
        opacity: 0;
      }
      &:nth-child(3) {
        transform: translateY(-9px) rotate(-45deg);
      }
    }
  }
}

.nav {
  @include media('lg') {
    margin-left: auto; 
  }
}

.nav__list {
  @include flex(row, center, center);
  list-style: none;
  gap: 2rem;
  
  @include media('md') {
    gap: 1.5rem;
  }
}

.nav__link {
  color: $text-primary;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: $border-radius;
  transition: all 0.3s ease;
  
  &:hover {
    color: $primary;
    background-color: rgba($primary, 0.1);
  }
  
  &--active {
    color: $primary;
    background-color: rgba($primary, 0.15);
  }
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-switcher {
  display: flex;
  gap: 0.25rem;
  
  button {
    background: none;
    border: 1px solid rgba($primary, 0.3);
    color: $text-primary;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.2s;
    
    &:hover {
      border-color: $primary;
      color: $primary;
    }
    
    &.active {
      background: $primary;
      color: white;
      border-color: $primary;
    }
  }
}

.telegram-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba($primary, 0.1);
  border-radius: 50%;
  transition: background 0.3s;
  color: $text-primary;
  flex-shrink: 0;

  &:hover {
    background: rgba($primary, 0.2);
    color: $primary;
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.search__btn {
  background: rgba($primary, 0.1);
  border: none;
  color: $text-primary;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  text-decoration: none;
  flex-shrink: 0;
  
  &:hover {
    background-color: rgba($primary, 0.2);
  }
}

@media (max-width: 768px) {
  .header__inner {
    flex-wrap: wrap;
  }
  
  .hamburger {
    display: flex;
    order: 1;
    margin-left: auto;
    margin-right: 0.5rem;
  }
  
  .header__actions {
    order: 2;
    margin-left: 0;
  }
  
  .nav {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: $secondary;
    border-top: 1px solid rgba($primary, 0.2);
    padding: 1rem 0;
    transform: translateY(-150%);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    pointer-events: none;
    box-shadow: $shadow-md;
    order: 3;
    
    &--open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    
    &__list {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    &__link {
      font-size: 1.1rem;
      width: 100%;
      text-align: center;
      padding: 0.75rem;
    }
  }
}

@media (max-width: 480px) {
  .header__actions {
    gap: 0.25rem;
  }
  
  .language-switcher button {
    padding: 0.2rem 0.4rem;
    font-size: 0.65rem;
  }
  
  .telegram-link {
    width: 32px;
    height: 32px;
  }
  
  .search__btn {
    width: 32px;
    height: 32px;
  }
}

.main {
  flex: 1;
  padding: 2rem 0;
  
  @include media('lg') {
    padding: 3rem 0;
  }
}

.footer {
  background-color: color-mix(in srgb, $secondary, black 5%);
  border-top: 1px solid rgba($primary, 0.1);
  padding: 3rem 0;
  margin-top: auto;
}

.footer__inner {
  @include flex(column, center, center);
  gap: 2rem;
  
  @include media('md') {
    @include flex(row, space-between, flex-start);
  }
}

.footer__info {
  text-align: center;
  
  @include media('md') {
    text-align: left;
  }
}

.footer__title {
  color: $primary;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.footer__text {
  color: $text-secondary;
}

.footer__links {
  @include flex(row, center, center);
  gap: 1.5rem;
  flex-wrap: wrap;
}

.footer__link {
  color: $text-secondary;
  text-decoration: none;
  
  &:hover {
    color: $primary;
  }
}

.footer__copyright {
  text-align: center;
  color: $text-muted;
  font-size: 0.9rem;
}

.footer__disclaimer {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  opacity: 0.7;
}
</style>
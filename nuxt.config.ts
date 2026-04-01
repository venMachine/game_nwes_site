export default defineNuxtConfig({
  // Модули Nuxt
  modules: [
    '@nuxt/image',
    '@nuxt/scripts',
   
   
  ],
plugins: [
  '~/plugins/fontawesome.js'
],
  
  css: [
    '~/assets/scss/main.scss'
  ],

  
  app: {
    head: {
      title: 'BarracudaGame - Игровые новости',
      htmlAttrs: {
        lang: 'ru'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Самые свежие новости из мира видеоигр, киберспорта и гейминга' 
        },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  
  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp', 'avif', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },

 
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      telegramChannelUrl: 'https://t.me/news_barracuda' 
    }
  },

 
  devtools: { enabled: true },

  
  typescript: {
    strict: false,
    typeCheck: false
  },

 
  nitro: {
    prerender: {
      routes: ['/'] 
    }
  },


  future: {
    compatibilityVersion: 4
  }
})

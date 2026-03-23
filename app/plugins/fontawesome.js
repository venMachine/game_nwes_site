import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons'

// Добавляем иконки в библиотеку (можно добавить любые другие)
library.add(faTelegram, faSearch, faUser)

// Опционально: отключаем автоматическое добавление CSS (чтобы не дублировать)
config.autoAddCss = false

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon)
})
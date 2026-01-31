import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/main.css'

// Toastification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Librerías de Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Importación completa de iconos sólidos, regulares y de márcas de
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Agregar todos los iconos a la librería
library.add(fas, far, fab)

// Registrar FontAwesome globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)
app.use(Toast)

app.mount('#app')

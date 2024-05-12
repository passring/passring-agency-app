import './assets/main.css'
import 'normalize.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import LoadingIcon from './components/LoadingIcon.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('LoadingIcon', LoadingIcon)

app.mount('#app')

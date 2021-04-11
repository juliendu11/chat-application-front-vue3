import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import './assets/styles/main.scss'

import FormGroup from '@/components/base/FormGroup.vue'
import Button from '@/components/base/Button.vue'

import ApolloPlugin from '@/plugins/apollo'

const app = createApp(App)

ApolloPlugin(app)

app.use(router)
app.component('FormGroup', FormGroup)
app.component('Button', Button)
app.mount('#app')

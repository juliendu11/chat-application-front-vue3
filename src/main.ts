import { createApp } from 'vue'
import dayjs from 'dayjs'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import Toast from 'vue-toastification'

import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import './assets/styles/main.scss'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import 'vue-toastification/dist/index.css'

import FormGroup from '@/components/base/FormGroup.vue'
import Button from '@/components/base/Button.vue'
import Switch from '@/components/base/Switch.vue'

import ApolloPlugin from '@/plugins/apollo'
import MittPlugin from '@/plugins/mitt'
import StorePlugin from '@/plugins/store'

import RelativeTime from 'dayjs/plugin/relativeTime'
import UpdateLocale from 'dayjs/plugin/updateLocale'

dayjs.extend(RelativeTime)
dayjs.extend(UpdateLocale)
dayjs.updateLocale('en', {
  relativeTime: {
    future: '%s',
    past: '%s ago',
    s: '1s',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1 y',
    yy: '%dy'
  }
})

const app = createApp(App)

ApolloPlugin(app)
MittPlugin(app)
StorePlugin(app)

app.use(PerfectScrollbar)
app.use(router)
app.use(Toast, { maxToasts: 10 })
app.component('FormGroup', FormGroup)
app.component('Button', Button)
app.component('Switch', Switch)
app.mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Quasar } from 'quasar'
import axios from 'axios'
import VueAxios from 'vue-axios'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
})

app.use(VueAxios, axios)
app.provide('$axios', app.config.globalProperties.axios)  // provide '$axios'

app.use(router)

app.mount('#app')

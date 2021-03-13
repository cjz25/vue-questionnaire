import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// bootstrap
import 'bootstrap/scss/bootstrap.scss'
import 'bootstrap'

// fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// axios
import axios from 'axios'
import VueAxios from 'vue-axios'

import {
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElDivider,
  ElTooltip,
  ElDialog
} from 'element-plus'

const components = [
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElSwitch,
  ElTable,
  ElTableColumn,
  ElDivider,
  ElTooltip,
  ElDialog
]

const app = createApp(App).use(store).use(router).use(VueAxios, axios)

components.forEach(component => {
  app.component(component.name, component)
})

library.add(fab, fas, far);
app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app')

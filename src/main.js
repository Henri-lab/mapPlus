
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import vuetify from './plugins/vuetify'; // 引入 Vuetify 配置文件
// 导入vant组件库
import { IndexBar, IndexAnchor, Cell } from "vant";
import "vant/lib/index.css";

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(vuetify)
// 使用vant组件库
app.use(IndexBar).use(IndexAnchor).use(Cell);

app.provide('app', app)

app.mount('#app')

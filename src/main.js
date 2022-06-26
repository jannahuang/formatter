import { createApp } from 'vue' // Vue 3.x 引入 vue 的形式
import App from './App.vue' // 引入 APP 页面组建
// 引入 highlight.js
import "highlight.js/styles/a11y-light.css"
import "highlight.js/lib/common"
import hljsVuePlugin from "@highlightjs/vue-plugin"

const app = createApp(App) // 通过 createApp 初始化 app
app.use(hljsVuePlugin)
app.mount('#root') // 将页面挂载到 root 节点


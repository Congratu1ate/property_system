import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router.js';  // 导入路由配置

createApp(App)
  .use(router)  // 使用路由
  .mount('#app');

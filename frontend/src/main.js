import { createApp } from 'vue';  // Vue 3でのインポート方法
import App from './App.vue';
import router from './router';

createApp(App)
  .use(router)
  .mount('#app');

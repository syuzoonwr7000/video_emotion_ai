import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';  // HomePageコンポーネントのインポート
import AboutPage from '../components/AboutPage.vue';  // AboutPageコンポーネントのインポート

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/aboutPage',
    name: 'AboutPage',
    component: AboutPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadView from '@/views/UploadView.vue'
import ResultView from '@/views/ResultView.vue'
import DetailView from '@/views/DetailView.vue'
import ListView from '@/views/ListView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadView
  },
  {
    path: '/result',
    name: 'result',
    component: ResultView
  },
  {
    path: '/view/:pdf_id',
    name: 'DetailView',
    component: DetailView
  },
  {
    path: '/view/',
    name: 'ListView',
    component: ListView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
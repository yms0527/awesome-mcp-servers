import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../src/components/HomeView.vue'
import UploadView from '../src/components/UploadView.vue'
import ResultView from '../src/components/ResultView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/upload', name: 'Upload', component: UploadView },
  { path: '/result', name: 'Result', component: ResultView }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/add-exercise',
    name: 'Add Exercise',
    component: () => import(/* webpackChunkName: "Add Exercise" */ '@/views/AddExercise'),
  },
  {
    path: '/track-exercise',
    name: 'Track Exercise History',
    component: () => import(/* webpackChunkName: "Track Exercise" */ '@/views/TrackExercise'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

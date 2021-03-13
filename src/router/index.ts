import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import QuestionnaireEdit from '../views/QuestionnaireEdit.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'Questionnaires',
    component: Home
  },
  {
    path: '/add',
    name: 'QuestionnaireAdd',
    component: QuestionnaireEdit
  },
  {
    path: '/:id(\\d+)/edit',
    name: 'QuestionnaireEdit',
    component: QuestionnaireEdit,
    props: true
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
